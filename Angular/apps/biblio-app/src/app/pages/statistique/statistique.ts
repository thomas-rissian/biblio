import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { forkJoin, of } from 'rxjs';
import { catchError, timeout, finalize } from 'rxjs/operators';
import * as d3 from 'd3';
import { Loader } from '@libs/ui/loader/loader';
import { AuthorsService } from '@biblio-app/core/service/author.service';
import { BooksService } from '@biblio-app/core/service/book.service';
import { CategoriesService } from '@biblio-app/core/service/categorie.service';

@Component({
  selector: 'app-statistique',
  standalone: true,
  imports: [CommonModule, RouterModule, Loader],
  templateUrl: './statistique.html',
})
export class Statistique implements OnInit, AfterViewInit, OnDestroy {
  loading: boolean = false;
  totalBooks: number = 0;
  totalAuthors: number = 0;
  totalCategories: number = 0;

  
  booksByCategory: { name: string; value: number }[] = [];
  categoryDistribution: { name: string; value: number }[] = [];
  private svgBar?: SVGElement | null;
  private svgPie?: SVGElement | null;
  

  constructor(private authorsService: AuthorsService, private booksService: BooksService, private categoriesService: CategoriesService, private cd: ChangeDetectorRef) {}

  

  ngOnInit(): void {
    this.loading = true;
    const maxTimer = setTimeout(() => { if (this.loading) { this.loading = false; try { this.cd.detectChanges(); } catch(e) {} } }, 65000);
    
    this.categoriesService.getCategories(1, 100).pipe(timeout(15000), catchError(e => { return of([]); })).subscribe({
      next: (categories: any[]) => {
        this.totalCategories = (categories || []).length;
        const requests = (categories || []).map((c: any) => this.booksService.getBooksByCategory(c.id).pipe(catchError((e: any) => { return of([]); })));
        
        const authorsCall = this.authorsService.getAuthors(1, 100).pipe(catchError((e: any) => { return of([]); }));
        forkJoin([...requests, authorsCall]).pipe(finalize(() => { clearTimeout(maxTimer); this.loading = false; try { this.cd.detectChanges(); } catch (e) {} })).subscribe({
          next: (results: any[]) => {
            const authorsList = results.length ? results[results.length - 1] : [];
            const booksLists = results.slice(0, Math.max(0, results.length - 1));
            const perCategoryCounts = (categories || []).map((c: any, idx: number) => ({ id: c.id, name: c.name, value: (booksLists[idx] || []).length }));
            this.booksByCategory = perCategoryCounts;
            this.categoryDistribution = perCategoryCounts;
            this.totalBooks = perCategoryCounts.reduce((s: number, it: any) => s + (it.value || 0), 0);
            
            
            const uniqueAuthors = new Set<number>();
            booksLists.forEach((list: any[]) => {
              (list || []).forEach(b => b.author && uniqueAuthors.add(b.author.id));
            });
            if (uniqueAuthors.size) this.totalAuthors = uniqueAuthors.size; else this.totalAuthors = (authorsList || []).length;
            try { this.renderBarChart(); this.renderPieChart(); } catch (e) { }
          },
          error: (e: any) => { }
        });
      },
      error: (e: any) => { clearTimeout(maxTimer); this.loading = false; }
    });
  }

  ngAfterViewInit(): void {
    
    try { this.renderBarChart(); this.renderPieChart(); } catch (e) { }
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.destroyCharts();
  }

  private onResize = () => {
    
    try { this.renderBarChart(); this.renderPieChart(); } catch (e) { }
  }

  
  private renderBarChart(): void {
    const container = document.getElementById('booksByCategoryChart');
    if (!container) return;
    
    container.innerHTML = '';
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 260;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const data = this.booksByCategory || [] as any[];
    if (!data.length) {
    
      container.innerHTML = '<div class="text-gray-400 text-sm p-2">Aucune donnée disponible</div>';
      return;
    }
    
    const x = d3.scaleBand().range([0, innerWidth]).padding(0.1).domain(data.map((d: any) => String(d.id)));
    const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, d3.max(data, (d: any) => d.value) || 0]);
    g.append('g').call(d3.axisLeft(y).ticks(5)).attr('class', 'y-axis');
    const xAxis = g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    
    xAxis.selectAll('text').text((d: any) => {
      const found = data.find((u: any) => String(u.id) === String(d));
      return found?.name ?? String(d);
    }).attr('transform', 'rotate(-45)').style('text-anchor', 'end');
    g.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('x', (d: any) => x(String(d.id)) ?? 0).attr('y', (d: any) => y(d.value)).attr('width', x.bandwidth()).attr('height', (d: any) => innerHeight - (y(d.value))).attr('fill', '#3b82f6');
    this.svgBar = svg.node();
  }

  private renderPieChart(): void {
    const container = document.getElementById('categoryPieChart');
    if (!container) return;
    container.innerHTML = '';
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 260;
    const radius = Math.min(width, height) / 2;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', `translate(${width / 2},${height / 2})`);
    const data = this.categoryDistribution || [];
    if (!data.length) {
      container.innerHTML = '<div class="text-gray-400 text-sm p-2">Aucune donnée disponible</div>';
      return;
    }
    const pie = d3.pie<any>().value((d: any) => d.value);
    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius - 10);
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.name));
    const arcs = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
    arcs.append('path').attr('d', arc as any).attr('fill', (d: any) => color(d.data.name as string) as string);
    arcs.append('text').attr('transform', (d: any) => `translate(${(arc.centroid(d) as any)})`).attr('dy', '0.35em').style('font-size', '10px').style('text-anchor', 'middle').text((d: any) => d.data.name);
    this.svgPie = (svg.node() as SVGElement);
  }

  private destroyCharts(): void {
    try {
      const b = document.getElementById('booksByCategoryChart');
      if (b) b.innerHTML = '';
      const p = document.getElementById('categoryPieChart');
      if (p) p.innerHTML = '';
    } catch (e) {
      
    }
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataCacheService {
  private memoryCache: { [key: string]: any } = {}; 
  private readonly LOCAL_STORAGE_KEY = 'api_cache';

  constructor(private http: HttpClient) {}

  getData(key: string): Observable<any> {
    if (this.memoryCache[key]) {
      return of(this.memoryCache[key]);
    }

    const cachedData = localStorage.getItem(`${this.LOCAL_STORAGE_KEY}_${key}`);
    if (cachedData) {
      this.memoryCache[key] = JSON.parse(cachedData); 
      return of(JSON.parse(cachedData));
    }

    console.warn(`No cached data for key: ${key}`);
    return of(null); 
  }

  cacheData(key: string, data: any): void {
    this.memoryCache[key] = data; 
    localStorage.setItem(`${this.LOCAL_STORAGE_KEY}_${key}`, JSON.stringify(data)); 
  }

  clearCache(): void {
    this.memoryCache = {};
    localStorage.clear();
  }
}

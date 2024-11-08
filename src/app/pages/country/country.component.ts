import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit{
  public olympics$: Observable<any> = of(null);
  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(data => {
      this.foundCountry(data)
    });
  }

  foundCountry(data: OlympicCountry[]) {
    const countryId = this.route.snapshot.params['id']
    console.log(countryId);
    console.log(data);
    
    const country = data.find(data =>  data.id === countryId )
    console.log(country);
    
  }
}

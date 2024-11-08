import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  olympics: any = [];
  
  public pieChartType: ChartType = 'pie';
  public pieChartLabels = [];
  public pieChartData: { data: number[], backgroundColor: string[] }[] = [
    { data: [],
      backgroundColor: ['#793D52', '#89A1DB', '#9780A1', '#BFE0F1', '#956065'] // Colors for each segment
     }
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartOptions: ChartOptions = {
    responsive: false,
    onClick: (event, elements) => {
      console.log(elements);
      
      // Vérifier si un segment a été cliqué
      if (elements.length > 0) {
        const chartElement = elements[0];
        const index = chartElement.index; // Index du segment cliqué
        this.onSegmentClick(index);
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Arial',
            size: 14,
            weight: 'bold'
          },
          color: '#333'
        }
      },
      tooltip: {
        backgroundColor: '#04838F',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (tooltipItem) => {
            return `🏅${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.loadOlympics();
  }

  async loadOlympics() {
    try {
      this.olympics = await this.olympicService.getOlympicsData();
            
      this.olympics.forEach((countryInfo: OlympicCountry) => {
        const totalMedalsCount = countryInfo.participations.reduce((sum, event) => sum + event.medalsCount, 0);
        this.pieChartData[0].data.push(totalMedalsCount)
      });
        
      this.pieChartLabels = this.olympics.map((item: any) => item.country);
    } catch (error) {
      console.error('Error loading olympics data', error);
    }
  }

    onSegmentClick(index: number) {
    const segmentId = this.olympics[index].id;
    console.log(segmentId);
    
    this.router.navigate([`/country/${segmentId}`])
  }
}

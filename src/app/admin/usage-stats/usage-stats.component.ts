import { HttpService } from './../../http.service';
import { CacheService } from './../../cache.service';
import { LocalService } from './../../local.service';
import { Component, OnInit } from '@angular/core';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-usage-stats',
  templateUrl: './usage-stats.component.html',
  styleUrls: ['./usage-stats.component.scss']
})
export class UsageStatsComponent implements OnInit {

  public headerCollapsed = false;
  public anglePos = 'down';
  public activeTab: string = 'basic';
  public storageStats: any = [];
  public storageUsed: string = '';

  public basicStats: any = {
    boards_updated: '96',
    people_posted: '2',
    updates_in_boards: '9',
    storage_used: '148.72 MB',
    people_joined: '96',
    people_contributed: '2',
    invited_but_didnt_join: '9',
  };

  public automationStats: any = {
    upgrade_date: 'Nov 08, 2022 - Jan 01, 2023',
    projected_actions: '20',
    actions_available: '25000',
    actions_used: '11',
  }

  public integrationsStats: any = {
    upgrade_date: 'Nov 08, 2022 - Jan 01, 2023',
    projected_actions: '20',
    actions_available: '25000',
    actions_used: '11',
  }

  initOpts = {
    renderer: 'svg',
    width: 400,
    height: 400
  };

  options: EChartsOption = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [{
      type: 'value'
    }],
    series: [{
      name: 'Counters',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    }]
  };

  constructor(
    private localStore: LocalService,
    public cache: CacheService,
    public httpService: HttpService,
  ) { }

  headerToggle() {
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  ngOnInit(): void {
    this.getData();
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  getData() {
    this.getStorage();
    this.getBasicStats();
    this.getAutomationStats();
    this.getIntegrationsStats();
    this.getAdvancesStats();
  }

  getStorage() {
    const queryParams = 'state_key=storage'
    this.httpService.getUsageState(queryParams).subscribe((res: any) => {
      this.storageUsed = res.storage_used;
      const storageKeys = Object.entries(res).map(([key, value]: any) => {
        if(['image/png', 'image/jpeg', 'text/plain', 'text/html', 'image/gif'].includes(key)) {
          this.storageStats.push([key, value]);
        }
      });
    });
  }

  getBasicStats() {
    const queryParams = 'state_key=basic'
    this.httpService.getUsageState(queryParams).subscribe((res: any) => {
      console.log('basic res', res);
    });
  }

  getAutomationStats() {
    const queryParams = 'state_key=automations'
    this.httpService.getUsageState(queryParams).subscribe((res: any) => {
      console.log('automations res', res);
    });
  }

  getIntegrationsStats() {
    const queryParams = 'state_key=integrations'
    this.httpService.getUsageState(queryParams).subscribe((res: any) => {
      console.log('integrations res', res);
    });
  }

  getAdvancesStats() {
    const queryParams = 'state_key=advances'
    this.httpService.getUsageState(queryParams).subscribe((res: any) => {
      console.log('advances res', res);
    });
  }


}

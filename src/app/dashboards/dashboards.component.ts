import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { HttpService } from '../http.service';
import { CacheService } from '../cache.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { LocalService } from '../local.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  headerCollapsed = false;
  titleStyle = '';
  legendSettings= '';
  anglePos = 'down';
  folded = false;
  pipelineEdit = false;
  addNewCol = false;

  chartOption1: any = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      dimension: 0,
      seriesIndex: 0,
      pieces: [
        {
          gt: 1,
          lt: 3,
          color: '#f1f1f1'
        },
        {
          gt: 5,
          lt: 7,
          color: '#f1f1f1'
        }
      ]
    },
    series: [
      {
        data: [{date: '20th Jan', value: 5}, {date: '23th Jan', value: 67}, {date: '24th Jan', value: 44}, {date: '25th Jan', value: 120}, {date: '28th Jan', value: 34}],
        type: 'line',
        smooth: 0.6,
        symbol: 'none',
        lineStyle: {
          color: '#5470C6',
          width: 5
        }
      },
      {
        data: [{date: '21th Jan', value: 44}, {date: '24th Jan', value: 120}, {date: '30th Jan', value: 5}, {date: '30th Jan', value: 67}, {date: '31th Jan', value: 34}],
        type: 'line',
        smooth: 0.6,
        symbol: 'none',
        lineStyle: {
          color: '#5470B6',
          width: 5
        }
      }
    ]
  };

  chartOption2: EChartsOption = {
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [0, 150],
        center: ['50%', '50%'],
        itemStyle: {
          borderRadius: 0
        },
        data: [
          { value: 40, name: 'Paid' },
          { value: 38, name: 'Unpaid' },
          { value: 32, name: 'Draft' },
          { value: 30, name: 'Sent' },
          { value: 28, name: 'Overdue' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  chartOption3: any = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
    },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'ascending',
        gap: 5,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: []
      }
    ]
  };

  public newCustomersChart: any = {
    title: 'New Customers',
    tooltip: { enable: true },
    primaryXAxis: { title: '', valueType: 'Category', labelIntersectAction: 'Rotate45' },
    primaryYAxis: {},
    legendSettings: { visible: true, position: "Bottom" },
    type: 'Column',
    name: 'New Customers',
    xName: 'date',
    yName: 'customers',
    chartData: [],
  }

  SalesTrendForecastChart: any = {
    foreCastData: [],
    dealValueData: [],
    totalForeCastValue: 0,
    totalDealValue: 0,
    chartArea: {
        border: {
            width: 0
        }
    },
    //Initializing Primary X Axis
    primaryXAxis: {
        valueType: 'Category',
        interval: 1, majorGridLines: { width: 0 },
        labelIntersectAction: 'Rotate45',
        majorTickLines: {width: 0},
        minorTickLines: {width: 0},
        labelStyle: { color: 'var(--at-font-color)' }

    },
    //Initializing Primary Y Axis
    primaryYAxis: {
        labelFormat: '{value}',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        labelStyle: { color: 'var(--at-font-color)' }
    },
    marker: {
        visible: true,
        width: 7,
        height: 7
    },
    tooltip: {
        enable: true
    },
    legend: {
        visible: true,
        enableHighlight : true,
    },
    title: 'Sales trend w/forecast',
    titleStyle : {color: "var(--at-font-color)"},
    legendSettings: {textStyle:{color:'var(--at-font-color)'}, visible: true, position: 'Bottom'}
  }

  dashboardId: any;
  public opportunitiesBoard: any = {};
  public accountsBoard: any = {};
  public wonDeals: any[] = [];
  public activeDeals: any[] = [];
  public dealStages: any[] = [];

  public currentUser = this.localStore.get('userData');
  public users: any = [];
  public showUserDropDown = false;
  public peopleSearchString = '';
  public filteredPeople: any = [];

  // declare widgets variables
  public revenue: any = 0;
  public monthRevenue: any = 0;
  public lastMonthRevenue: any = 0;
  public expectedRevenue: any = 0;
  public monthExpectedRevenue: any = 0;
  public lastMonthExpectedRevenue: any = 0;
  public pipelineDeals: any = 0;
  public monthPipelineDeals: any = 0;
  public lastMonthPipelineDeals: any = 0;
  public widgetWonDeals: any = 0;
  public monthWonDeals: any = 0;
  public lastMonthWonDeals: any = 0;
  public lostDeals: any = 0;
  public monthLostDeals: any = 0;
  public lastMonthLostDeals: any = 0;
  public dealsConversion: any = 0;
  public monthDealsConversion: any = 0;
  public lastMonthDealsConversion: any = 0;
  public monthRevenueConversion: any = 0;
  public expectedRevenueConversion: any = 0;
  public pipelineDealsConversion: any = 0;
  public wonDealsConversion: any = 0;
  public lostDealsConversion: any = 0;
  public lastToThisMonthConversion: any = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cache: CacheService,
    public httpService: HttpService,
    private localStore: LocalService,
    ) {
  }

  ngOnInit(): void {
    this.getNavEvents();
    this.getData();
    this.setData();
  }

  /**
   * Get nav events
   */
  getNavEvents() {
    // Get ID without nav change, this will help to fix the issue of not loading on reload the page
    this.dashboardId = this.route.snapshot.paramMap.get('id');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        this.dashboardId = this.route.snapshot.paramMap.get('id');
      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar
        // Present error to user
      }
    });
  }

  headerToggle(){
    (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
    (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
  }

  colFolded(){
    this.folded = true;
  }

  colUnfolded(){
    if(this.folded == true){
      this.folded = false;
    }
  }

  editPipeline(event:any){
    if(event == 'show'){
      this.pipelineEdit = true;
    }else{
      this.pipelineEdit = false;
    }
  }

  addNewColumn(event:any){
    if(event == 'show'){
      this.addNewCol = true;
    }else{
      this.addNewCol = false;
    }
  }

  drop(event:any){
    event.container.data,
        event.previousIndex,
        event.currentIndex
  }

  setData() {
    this.setDealStages();
    this.setWonDeals();
    this.setActiveDeals();
    this.setSalesFunnel();
    this.setNewCustomersChart();
    this.setSalesTrendForecastChart();
    this.setWidgetsValues();
  }

  getData() {
    this.getUsers();
    this.getOpportunities();
    this.getAccounts();
  }

  getOpportunities() {
    const localBoard = this.cache.getBoardCache(2);

    if (localBoard) {
      this.opportunitiesBoard = localBoard;
    } else {
      this.httpService.getSingleBoard(2).subscribe((data:any) => {
        this.opportunitiesBoard = data;
        this.cache.setBoardCache(2, data);
      });
    }
  }

  getAccounts() {
    const localBoard = this.cache.getBoardCache(4);

    if (localBoard) {
      this.accountsBoard = localBoard;
    } else {
      this.httpService.getSingleBoard(4).subscribe((data:any) => {
        this.accountsBoard = data;
        this.cache.setBoardCache(4, data);
      });
    }
  }

  setWonDeals() {
    const groups = this.opportunitiesBoard?.groups? (JSON.parse(JSON.stringify(this.opportunitiesBoard?.groups))): [];
    let deals: any[] = [];
    groups?.every((group: any) => {
      if(group?.name === 'Won') {
        deals = [...group?.entries];
        return false;
      }
      return true;
    });

    this.wonDeals = deals.map((deal: any) => {
      if(deal.owner.length) {
        let ownerIds = deal.owner.split(',') || [];
        let ownerNames: string[] = [];

        ownerIds.forEach((id: string) => {
          let owner = this.users.find((user: any) => user.ID === id);
          ownerNames.push(owner.display_name);
        });

        deal.ownerNames = ownerNames;
      }
      return deal;

    });

  }

  getInitials(str = '') {
    const initials = str
      .split(' ')
      .map(word => word.charAt(0))
      .join('');

    return initials;
  }

  setActiveDeals() {
    const groups = this.opportunitiesBoard?.groups && (JSON.parse(JSON.stringify(this.opportunitiesBoard?.groups)));
    groups?.every((group: any) => {
      if(group?.name === 'Active') {
        this.activeDeals = group?.entries.map((deal: any) => {
          if(deal.stage) {
            const stage = this.dealStages?.find((stage: any) => {
              return stage.id === deal.stage;
            });

            deal.stageName = stage.name;
            deal.stageColor = stage.color;
          }
          return deal;
        });
        return false;
      }
      return true;
    });

    this.activeDeals.sort((a: any, b: any) => a.deal_value - b.deal_value);
  }

  setDealStages() {
    this.opportunitiesBoard?.columns?.every((col: any) => {
      if(col?.key === 'stage' && col?.type === 'status') {
        this.dealStages = [...col?.statuses];
        return false;
      }
      return true;
    });
  }

  setSalesFunnel() {
    let entries: any[] =[];

    this.opportunitiesBoard?.groups?.forEach((group: any) => {
      if(group.name === 'Won' || group.name === 'Active') {
        entries.push(...group.entries);
      }
    });

    entries = entries.filter((entry: any) => !!entry.stage);

    entries.forEach((entry: any) => {
      if(entry.stage) {
        const stage = this.dealStages?.find((stage: any) => {
          return stage.id === entry.stage;
        });

        entry.stageName = stage.name;
        entry.stageColor = stage.color;
      }
    });

    const result = _(entries)
      .groupBy(v => v.stageName)
      .mapValues(v => _.map(v, 'stageName'))
      .value();

    let chartData: any[] = [];

      Object.entries(result).forEach((entry: any) => {
        const [key, value] = entry;

        chartData.push({
          name: key,
          value: Math.round((100 * value.length) / entries.length),
        });
      });

    this.chartOption3.series[0].data = [...chartData];
  }

  setNewCustomersChart() {
    const groups = this.accountsBoard?.groups && (JSON.parse(JSON.stringify(this.accountsBoard?.groups)));
    let entries: any[] = [];

    groups?.every((group: any) => {
      if(group?.name === 'Active') {
        entries.push(...group?.entries);
        return false;
      }
      return true;
    });

    let result: any = _(entries)
    .groupBy(v => moment(v.created.date).format('MMM DD, YYYY'))
    .mapValues(v => _.map(v, 'item'))
    .value();

    result = Object.entries(result).map((ele: any) => { return {date: ele[0], customers: ele[1].length}});

    this.addMissingMonthDates(result);

    result.sort((a: any, b: any) => {
      const aDate: any = new Date(a.date);
      const bDate: any = new Date(b.date);
      return aDate - bDate;
    }).forEach((data: any) => { data.date = moment(data.date).format('MMM Do') });

    this.newCustomersChart.chartData = result;
  }

  setSalesTrendForecastChart() {
    const groups = this.opportunitiesBoard?.groups && (JSON.parse(JSON.stringify(this.opportunitiesBoard?.groups)));
    let entries: any[] = [];
    let foreCastData: any;
    let dealValueData: any;

    groups?.forEach((group: any) => {
      if(group.name === 'Won' || group.name === 'Active') {
        entries.push(...group.entries);
      }
    });

    const foreCastEntries: any[] = entries.filter((entry: any) => {
      entry.forecast_value = Number(entry.forecast_value);
      return !!entry.forecast_value && moment(entry.created.date).isSame(new Date(), 'month');
    });
    const dealValueEntries: any[] = entries.filter((entry: any) => {
      entry.deal_value = Number(entry.deal_value);
      return !!entry.deal_value && moment(entry.created.date).isSame(new Date(), 'month');
    });

    foreCastData = _(foreCastEntries)
    .groupBy(v => moment(v.created.date).format('MMM DD, YYYY'))
    .mapValues(v => _.map(v, 'forecast_value'))
    .value();

    dealValueData = _(dealValueEntries)
    .groupBy(v => moment(v.created.date).format('MMM DD, YYYY'))
    .mapValues(v => _.map(v, 'deal_value'))
    .value();

    foreCastData = Object.entries(foreCastData).map((ele: any) => { return {date: ele[0], value: ele[1].reduce((total: number, num: number) => total + num )}});
    dealValueData = Object.entries(dealValueData).map((ele: any) => { return {date: ele[0], value: ele[1].reduce((total: number, num: number) => total + num )}});

    foreCastData.length && (this.SalesTrendForecastChart.totalForeCastValue = foreCastData.reduce((a: any, b: any) => ({value: a.value + b.value}))?.value);
    dealValueData.length && (this.SalesTrendForecastChart.totalDealValue = dealValueData.reduce((a: any, b: any) => ({value: a.value + b.value}))?.value);

    this.addMissingMonthDates(foreCastData);
    this.addMissingMonthDates(dealValueData);

    foreCastData.sort((a: any, b: any) => {
      const aDate: any = new Date(a.date);
      const bDate: any = new Date(b.date);
      return aDate - bDate;
    }).forEach((data: any) => { data.date = moment(data.date).format('MMM Do') });


    dealValueData.sort((a: any, b: any) => {
      const aDate: any = new Date(a.date);
      const bDate: any = new Date(b.date);
      return aDate - bDate;
    }).forEach((data: any) => { data.date = moment(data.date).format('MMM Do') });

    this.SalesTrendForecastChart.foreCastData = foreCastData;
    this.SalesTrendForecastChart.dealValueData = dealValueData;
  }

  addMissingMonthDates(array: any) {
    const dates = array.map((ele: any) => ele.date);

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const now = startOfMonth.clone();

    while (now.isSameOrBefore(endOfMonth)) {
      let date = now.format('MMM DD, YYYY');
      if(!dates.includes(date)) {
        array.push( { date, value: 0 } );
      }
      now.add(1, 'days');
    }
  }
  // set variables values to display in dashboards widgets
  setWidgetsValues() {
    const boardData = this.opportunitiesBoard.groups;

    // get active deals from the board data
    const activeDeals = boardData?.filter( ( board: any ) => {
      return board.name == 'Active';
    } );

    // get won deals from the board data
    const widgetWonDeals = boardData?.filter( ( board: any ) => {
      return board.name == 'Won';
    } );

    // get lost deals from the board data
    const lostDeals = boardData?.filter( ( board: any ) => {
      return board.name == 'Lost';
    } );

    // get this month lost deals
    const monthLostDeals = lostDeals?.[0]?.entries?.filter( ( deal: any ) => {
      return this.isCurrentMonthDate( deal?.created?.date );
    } );

    // get last month lost deals
    const lastMonthLostDeals = lostDeals?.[0]?.entries?.filter( ( deal: any ) => {
      return this.isLastMonthDate( deal.created.date );
    } );

    // get this month won deals
    const monthWonDeals = widgetWonDeals?.[0]?.entries?.filter( ( deal: any ) => {
      return this.isCurrentMonthDate( deal.created.date );
    } );

    // total revenue
    this.revenue = this.calculateSum( widgetWonDeals?.[0]?.entries, 'actual_deal_value' );

    // this month revenue
    this.monthRevenue = this.calculateSum( monthWonDeals, 'actual_deal_value' );

    // get last month won deals
    const lastMonthWonDeals = widgetWonDeals?.[0]?.entries?.filter( ( deal: any ) => {
      return this.isLastMonthDate( deal.created.date );
    } );

    // last month revenue
    this.lastMonthRevenue = this.calculateSum( lastMonthWonDeals, 'actual_deal_value' );

    // total expected revenue
    this.expectedRevenue = this.getExpectedRevenue( activeDeals?.[0]?.entries );

    // get this month active deals
    const monthActiveDeals = activeDeals?.[0]?.entries?.filter( ( deal: any ) => {
      return this.isCurrentMonthDate( deal.created.date );
    } );

    // this month expected revenue
    this.monthExpectedRevenue = this.getExpectedRevenue( monthActiveDeals );

    // get last month active deals
    const lastMonthActiveDeals = activeDeals?.[0]?.entries?.filter( ( deal: any ) => {
      return this.isLastMonthDate( deal.created.date );
    } );

    // last month expected revenue
    this.lastMonthExpectedRevenue = this.getExpectedRevenue( lastMonthActiveDeals );

    // set pipeline deals
    this.pipelineDeals = activeDeals?.[0]?.entries?.length;

    // set this month pipeline deals
    this.monthPipelineDeals = monthActiveDeals.length;

    // set won deals
    this.widgetWonDeals = widgetWonDeals?.[0]?.entries?.length;

    // set this month won deals
    this.monthWonDeals = monthWonDeals.length;

    // set lost deals
    this.lostDeals = lostDeals?.[0]?.entries?.length;

    // set this month lost deals
    this.monthLostDeals = monthLostDeals?.length;

    // calculate complete deals conversion
    if( this.widgetWonDeals > 0 ) {
      this.dealsConversion = ( ( this.lostDeals / this.widgetWonDeals ) * 100 ).toFixed(2);
    } else {
      this.dealsConversion = 0;
    }

    // calculate this month deals conversion
    if( this.monthWonDeals > 0 ) {
      this.monthDealsConversion = ( ( this.monthLostDeals / this.monthWonDeals ) * 100 ).toFixed(2);
    } else {
      this.monthDealsConversion = 0;
    }

    // calculate last month deals conversion
    this.lastMonthDealsConversion = ( ( lastMonthLostDeals.length / lastMonthWonDeals.length ) * 100 ).toFixed(2);

    let difference = 0;

    // set this month revenue conversion
    if( this.lastMonthRevenue > 0 ) {
      difference = this.monthRevenue - this.lastMonthRevenue;
      this.monthRevenueConversion = ( ( difference / this.lastMonthRevenue ) * 100 ).toFixed(2);
    } else {
      this.monthRevenueConversion = 100;
    }

    // set expected revenue conversion
    if( this.lastMonthExpectedRevenue > 0 ) {
      difference = this.monthExpectedRevenue - this.lastMonthExpectedRevenue;
      this.expectedRevenueConversion = ( ( difference / this.lastMonthExpectedRevenue ) * 100 ).toFixed(2);
    } else {
      this.expectedRevenueConversion = 100;
    }

    // set pipeline deals conversion
    if( lastMonthActiveDeals.length > 0 ) {
      difference = this.monthPipelineDeals - lastMonthActiveDeals.length;
      this.pipelineDealsConversion = ( ( difference / lastMonthActiveDeals.length ) * 100 ).toFixed(2);
    } else {
      this.pipelineDealsConversion = 100;
    }

    // set won deals conversion
    if( lastMonthWonDeals.length > 0 ) {
      difference = this.monthWonDeals - lastMonthWonDeals.length;
      this.wonDealsConversion = ( ( difference / lastMonthWonDeals.length ) * 100 ).toFixed(2);
    } else {
      this.wonDealsConversion = 100;
    }

    // set lost deals conversion
    if( lastMonthLostDeals.length > 0 ) {
      difference = this.monthLostDeals - lastMonthLostDeals.length;
      this.lostDealsConversion = ( ( difference / lastMonthLostDeals.length ) * 100 ).toFixed(2);
    } else {
      this.lostDealsConversion = 100;
    }

    // set last month lost deals conversion
    if( this.lastMonthDealsConversion > 0 ) {
      difference = this.monthDealsConversion - this.lastMonthDealsConversion;
      this.lastToThisMonthConversion = ( ( difference / this.lastMonthDealsConversion ) * 100 ).toFixed(2);
    } else {
      this.lastToThisMonthConversion = 100;
    }

  }

  // function to get sum of an array property
  calculateSum( array: any, property: any ) {
    const total = array.reduce( ( accumulator: any, object:any ) => {
      if( object[property] != undefined && parseInt( object[property] ) > 0 ) {
        return parseInt( accumulator ) + parseInt( object[property] );
      } else {
        return parseInt( accumulator );
      }

    }, 0);

    return total;
  }

  // check if date is in current month
  isCurrentMonthDate( date: any ) {
    let currentDate = new Date();
    currentDate = new Date( currentDate.getFullYear() + '-' + ( currentDate.getMonth() + 1 ) + "-1" );
    const monthTimestamp = currentDate.getTime();
    date = new Date( date );
    date = date.getTime();
    return ( date > monthTimestamp );
  }

  // check if date is from last month
  isLastMonthDate( date: any ) {
    const currentDate = new Date();
    const thisMonthDate = new Date( currentDate.getFullYear() + '-' + ( currentDate.getMonth() + 1 ) + "-1" );
    const monthTimestamp = thisMonthDate.getTime();
    const lastMonthDate = new Date( currentDate.getFullYear(), ( currentDate.getMonth() - 1 ), 1 );
    const lastMonthTimestamp = lastMonthDate.getTime();
    date = new Date( date );
    date = date.getTime();
    return ( date < monthTimestamp && date > lastMonthTimestamp );
  }

  // Get expected revenue
  getExpectedRevenue( entries: any ) {
    const total = entries.reduce( ( accumulator: any, object:any ) => {
      const dealValue = object.deal_value;
      const confidence = object.confidence;
      const forecastValue = parseFloat((dealValue * (confidence / 100)).toFixed(2)) || 0;
      return parseFloat( accumulator ) + forecastValue;
    }, 0);

    return total;
  }

  // limit progress bar with to max 100%
  getProgressBarWidth( width: any ) {
    if( width > 100 ) {
      return 100;
    } else {
      return Math.abs( Math.round( width ) );
    }
  }

  getUsers() {
    const users = this.cache.getUsersCache();
    if (users) {
      this.users = users;
    } else {
      this.httpService.getUsers().subscribe((res) => {
        this.cache.setUsersCache(res);
        this.users = res;
      });
    }
  }

  filterPeople() {
    if(this.peopleSearchString.length) {
      this.filteredPeople = this.users.filter((user: any) => {
        return user.display_name.toLowerCase().includes(this.peopleSearchString.toLowerCase());
      });
    } else {
      this.filteredPeople = this.users &&  (JSON.parse(JSON.stringify(this.users)));
    }
  }

  // filter data by user
  filterByUser( userID = 0, userName = '' ) {

    // check for user id
    if( userID > 0 ) {

      // get original board data
      const data = this.cache.getBoardCache(2);

      let entries: any = [];
      let entryUsers: any = [];

      for( let i = 0; i < data.groups.length; i++ ) {

        // filter entries by selected user
        data.groups[ i ].entries.forEach( ( entry: any ) => {
          entryUsers = entry.owner.split( ',' );
          if( entryUsers.includes( userID ) ) {
            entries.push( entry );
          }
        } );

        // set group filtered entries
        this.opportunitiesBoard.groups[ i ].entries = [...entries];
        entries = [];
      }

      // update data by calling setData method
      this.setData();

      // close the popup
      let element: HTMLElement = document.getElementById('filter-popup-close') as HTMLElement;
      element.click();
    } else {

      // reset entries
      this.getOpportunities();

      // update data by calling setData method
      this.setData();
    }
  }

}

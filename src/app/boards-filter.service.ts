import { Injectable } from '@angular/core';
import { CacheService } from "./cache.service";
import * as moment from 'moment';
import { map } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class BoardsFilterService {

  constructor(
    private cache: CacheService
  ) { }

  /*
  * Returns filtered group entries
  */
  applyFilter(groups: any, columns: any, filters: any) {
    const isNotAnd = (filters.length === 1 || filters[0].condition === 'or');
    const isAnd = filters[0].condition === 'and';
    let entries: any = [];
    let counter = 0;

    return groups?.filter((group: any) => {
      entries = [];
      group.entries.forEach((entry: any) => {
        filters.forEach((filter: any) => {
          const filterType = this.getTypeFromId(filter.where, columns);
          const key = this.getKeyFromId(filter.where, columns);
          // Date filters
          if (filterType === 'date') {

            // filter for 'empty' & 'not empty' dates
            if (['empty'].includes(filter.operator) && !entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            } else if (filter.operator === 'not-empty' && entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'is' & 'is not' operators
            if (['is', 'not', 'only', 'anything-but'].includes(filter.operator)) {

              // filter combinations for 'date -> is' & 'date -> only' operators
              if (['is', 'only'].includes(filter.operator) && filter.value === 'blank' && !entry[key]) {
                if (isNotAnd) {
                  let isDup = entries.some((e: any) => { return e.id === entry.id });
                  !isDup && entries.push(entry);
                } else if (isAnd) {
                  counter++;
                }
              }

              // filter combinations for 'date -> is not' & 'date -> anything but' operators
              else if (['not', 'anything-but'].includes(filter.operator) && filter.value === 'blank' && entry[key]) {
                if (isNotAnd) {
                  let isDup = entries.some((e: any) => { return e.id === entry.id });
                  !isDup && entries.push(entry);
                } else if (isAnd) {
                  counter++;
                }
              }

              // filter combinations for 'date -> today' operators
              else if (filter.value === 'today') {
                const entryDate = entry[key]?.split('T')[0];
                const today = moment().format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> today' && 'date -> only -> today' operators
                if (['is', 'only'].includes(filter.operator) && today === entryDate) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> today' && 'date -> anything but -> today' operators
                else if (['not', 'anything-but'].includes(filter.operator) && today !== entryDate) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> tomorrow' operators
              else if (filter.value === 'tomorrow') {
                const entryDate = entry[key]?.split('T')[0];
                const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> tomorrow' && 'date -> only -> tomorrow' operators
                if (['is', 'only'].includes(filter.operator) && tomorrow === entryDate) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> tomorrow' && 'date -> anything but -> tomorrow' operators
                else if (['not', 'anything-but'].includes(filter.operator) && tomorrow !== entryDate) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> yesterday' operators
              else if (filter.value === 'yesterday') {
                const entryDate = entry[key]?.split('T')[0];
                const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> yesterday' && 'date -> only -> yesterday' operators
                if (['is', 'only'].includes(filter.operator) && yesterday === entryDate) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> yesterday' && 'date -> anything but -> yesterday' operators
                else if (['not', 'anything-but'].includes(filter.operator) && yesterday !== entryDate) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> this week' operators
              else if (filter.value === 'this-week') {
                const entryDate = entry[key]?.split('T')[0];
                const startOfWeek = moment().startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
                const endOfWeek = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> this week' && 'date -> only -> this week' operators
                if (['is', 'only'].includes(filter.operator) && entryDate > startOfWeek && entryDate < endOfWeek) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> this week' && 'date -> anything but -> this week' operators
                else if (['not', 'anything-but'].includes(filter.operator) && (entryDate < startOfWeek || entryDate > endOfWeek)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> last week' operators
              else if (filter.value === 'last-week') {
                const entryDate = entry[key]?.split('T')[0];
                const startOfWeek = moment().subtract(1, 'weeks').startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
                const endOfWeek = moment().subtract(1, 'weeks').endOf('week').add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> last week' && 'date -> only -> last week' operators
                if (['is', 'only'].includes(filter.operator) && entryDate < endOfWeek && entryDate > startOfWeek) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> last week' && 'date -> anything but -> last week' operators
                else if (['not', 'anything-but'].includes(filter.operator) && (entryDate < startOfWeek || entryDate > endOfWeek)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> next week' operators
              else if (filter.value === 'next-week') {
                const entryDate = entry[key]?.split('T')[0];
                const startOfWeek = moment().add(1, 'weeks').startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
                const endOfWeek = moment().add(1, 'weeks').endOf('week').add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> next week' && 'date -> only -> next week' operators
                if (['is', 'only'].includes(filter.operator) && entryDate > startOfWeek && entryDate < endOfWeek) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> next week' && 'date -> anything but -> next week' operators
                else if (['not', 'anything-but'].includes(filter.operator) && (entryDate < startOfWeek || entryDate > endOfWeek)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> this month' operators
              else if (filter.value === 'this-month') {
                const entryDate = entry[key]?.split('T')[0];
                const startOfMonth = moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
                const endOfMonth = moment().endOf('month').add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> this month' && 'date -> only -> this month' operators
                if (['is', 'only'].includes(filter.operator) && entryDate > startOfMonth && entryDate < endOfMonth) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> this month' && 'date -> anything but -> this month' operators
                else if (['not', 'anything-but'].includes(filter.operator) && (entryDate < startOfMonth || entryDate > endOfMonth)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> last month' operators
              else if (filter.value === 'last-month') {
                const entryDate = entry[key]?.split('T')[0];
                const startOfMonth = moment().subtract(1, 'months').startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
                const endOfMonth = moment().subtract(1, 'months').endOf('month').add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> last month' && 'date -> only -> last month' operators
                if (['is', 'only'].includes(filter.operator) && entryDate > startOfMonth && entryDate < endOfMonth) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> last month' && 'date -> anything but -> last month' operators
                else if (['not', 'anything-but'].includes(filter.operator) && (entryDate < startOfMonth || entryDate > endOfMonth)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> next month' operators
              else if (filter.value === 'next-month') {
                const entryDate = entry[key]?.split('T')[0];
                const startOfMonth = moment().add(1, 'months').startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
                const endOfMonth = moment().add(1, 'months').endOf('month').add(1, 'days').format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> next month' && 'date -> only -> next month' operators
                if (['is', 'only'].includes(filter.operator) && entryDate > startOfMonth && entryDate < endOfMonth) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> next month' && 'date -> anything but -> next month' operators
                else if (['not', 'anything-but'].includes(filter.operator) && (entryDate < startOfMonth || entryDate > endOfMonth)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> past dates' operators
              else if (filter.value === 'past-dates') {
                const entryDate = entry[key]?.split('T')[0];
                const today = moment().format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> past dates' && 'date -> only -> past dates' operators
                if (['is', 'only'].includes(filter.operator) && entryDate < today) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> past dates' && 'date -> anything but -> past dates' operators
                else if (['not', 'anything-but'].includes(filter.operator) && entryDate >= today) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }

              // filter combinations for 'date -> future dates' operators
              else if (filter.value === 'future-dates') {
                const entryDate = entry[key]?.split('T')[0];
                const today = moment().format('YYYY-MM-DD');

                // filter combinations for 'date -> is -> future dates' && 'date -> only -> future dates' operators
                if (['is', 'only'].includes(filter.operator) && entryDate > today) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> is not -> future dates' && 'date -> anything but -> future dates' operators
                else if (['not', 'anything-but'].includes(filter.operator) && entryDate <= today) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }
            }

            // filter combinations for 'date -> past number of dates' && 'date -> future number of dates' operators
            else if (['last', 'next'].includes(filter.operator)) {
              const entryDate = entry[key]?.split('T')[0];
              const number = Number(filter.value?.split(',')[0]);
              const type = filter.value?.split(',')[1];
              const today = moment().format('YYYY-MM-DD');
              const upTo = moment().add(number + 1, type).format('YYYY-MM-DD');
              const downTo = moment().subtract(number + 1, type).format('YYYY-MM-DD');

              // filter combinations for 'date -> workdays' operators
              if (type === 'workdays') {
                const lastWorkDays = this.getWorkDays(number, 'last');
                const nextWorkDays = this.getWorkDays(number, 'next');

                // filter combinations for 'date -> past workdays' operators
                if (lastWorkDays.includes(entryDate)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> future workdays' operators
                else if (nextWorkDays.includes(entryDate)) {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              } else {

                // filter combinations for 'date -> past number of dates' operators
                if ((entryDate < today && entryDate > downTo) && filter.operator === 'last') {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }

                // filter combinations for 'date -> future number of dates' operators
                else if ((entryDate > today && entryDate < upTo) && filter.operator === 'next') {
                  if (isNotAnd) {
                    let isDup = entries.some((e: any) => { return e.id === entry.id });
                    !isDup && entries.push(entry);
                  } else if (isAnd) {
                    counter++;
                  }
                }
              }
            }

            // filter combinations for 'date -> between 2 dates' operators
            else if (filter.operator === 'between') {
              const entryDate = entry[key]?.split('T')[0];
              const dateRange = [];
              dateRange[0] = new Date(filter.value.split(',')[0]);
              dateRange[1] = new Date(filter.value.split(',')[1]);
              const startDate = moment(dateRange[0]).format('YYYY-MM-DD');
              const endDate = moment(dateRange[1]).format('YYYY-MM-DD');
              if (entryDate > startDate && entryDate < endDate) {
                if (isNotAnd) {
                  let isDup = entries.some((e: any) => { return e.id === entry.id });
                  !isDup && entries.push(entry);
                } else if (isAnd) {
                  counter++;
                }
              }
            }
            else if (['on-or-after', 'after', 'on-or-before', 'before'].includes(filter.operator)) {
              {

                // filter combinations for 'date -> today' operators
                if (filter.value === 'today') {
                  const entryDate = entry[key]?.split('T')[0];
                  const today = moment().format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> today' operators
                  if (['on-or-after'].includes(filter.operator) && (today === entryDate || entryDate > today)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> today' operators
                  else if (['on-or-before'].includes(filter.operator) && (today === entryDate || entryDate < today)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> today' operators
                  if (['after'].includes(filter.operator) && entryDate > today) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> today' operators
                  else if (['before'].includes(filter.operator) && entryDate < today) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> tomorrow' operators
                else if (filter.value === 'tomorrow') {
                  const entryDate = entry[key]?.split('T')[0];
                  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> tomorrow' operators
                  if (['on-or-after'].includes(filter.operator) && (tomorrow === entryDate || entry > tomorrow)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> tomorrow' operators
                  else if (['on-or-before'].includes(filter.operator) && (tomorrow === entryDate || entry < tomorrow)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> tomorrow' operators
                  if (['after'].includes(filter.operator) && entryDate > tomorrow) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> tomorrow' operators
                  else if (['before'].includes(filter.operator) && entryDate < tomorrow) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> yesterday' operators
                else if (filter.value === 'yesterday') {
                  const entryDate = entry[key]?.split('T')[0];
                  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> yesterday' operators
                  if (['on-or-after'].includes(filter.operator) && (yesterday === entryDate || entryDate > yesterday)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> yesterday' operators
                  else if (['on-or-before'].includes(filter.operator) && (yesterday === entryDate || entryDate < yesterday)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> yesterday' operators
                  if (['after'].includes(filter.operator) && entryDate > yesterday) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> yesterday' operators
                  else if (['before'].includes(filter.operator) && entryDate < yesterday) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> this week' operators
                else if (filter.value === 'this-week') {
                  const entryDate = entry[key]?.split('T')[0];
                  const startOfWeek = moment().startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
                  const endOfWeek = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> this week' operators
                  if (['on-or-after'].includes(filter.operator) && ((entryDate > startOfWeek && entryDate < endOfWeek) || entryDate > endOfWeek)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> this week' operators
                  else if (['on-or-before'].includes(filter.operator) && ((entryDate > startOfWeek && entryDate < endOfWeek) || entryDate < startOfWeek)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> this week' operators
                  if (['after'].includes(filter.operator) && entryDate > endOfWeek) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> this week' operators
                  else if (['before'].includes(filter.operator) && entryDate < startOfWeek) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> last week' operators
                else if (filter.value === 'last-week') {
                  const entryDate = entry[key]?.split('T')[0];
                  const startOfWeek = moment().subtract(1, 'weeks').startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
                  const endOfWeek = moment().subtract(1, 'weeks').endOf('week').add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> last week' operators
                  if (['on-or-after'].includes(filter.operator) && ((entryDate > startOfWeek && entryDate < endOfWeek) || entryDate > endOfWeek)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> last week' operators
                  else if (['on-or-before'].includes(filter.operator) && ((entryDate > startOfWeek && entryDate < endOfWeek) || entryDate < startOfWeek)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> last week' operators
                  if (['after'].includes(filter.operator) && entryDate > endOfWeek) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> last week' operators
                  else if (['before'].includes(filter.operator) && entryDate < startOfWeek) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> next week' operators
                else if (filter.value === 'next-week') {
                  const entryDate = entry[key]?.split('T')[0];
                  const startOfWeek = moment().add(1, 'weeks').startOf('week').subtract(1, 'days').format('YYYY-MM-DD');
                  const endOfWeek = moment().add(1, 'weeks').endOf('week').add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> next week' operators
                  if (['on-or-after'].includes(filter.operator) && ((entryDate > startOfWeek && entryDate < endOfWeek) || entryDate > endOfWeek)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> next week' operators
                  else if (['on-or-before'].includes(filter.operator) && ((entryDate > startOfWeek && entryDate < endOfWeek) || entryDate < startOfWeek)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> next week' operators
                  if (['after'].includes(filter.operator) && entryDate > endOfWeek) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> next week' operators
                  else if (['before'].includes(filter.operator) && entryDate < startOfWeek) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> this month' operators
                else if (filter.value === 'this-month') {
                  const entryDate = entry[key]?.split('T')[0];
                  const startOfMonth = moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
                  const endOfMonth = moment().endOf('month').add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> this month' operators
                  if (['on-or-after'].includes(filter.operator) && ((entryDate > startOfMonth && entryDate < endOfMonth) || entryDate > endOfMonth)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> this month' operators
                  else if (['on-or-before'].includes(filter.operator) && ((entryDate > startOfMonth && entryDate < endOfMonth) || entryDate < startOfMonth)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> this month' operators
                  if (['after'].includes(filter.operator) && entryDate > endOfMonth) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> this month' operators
                  else if (['before'].includes(filter.operator) && entryDate < startOfMonth) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> last month' operators
                else if (filter.value === 'last-month') {
                  const entryDate = entry[key]?.split('T')[0];
                  const startOfMonth = moment().subtract(1, 'months').startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
                  const endOfMonth = moment().subtract(1, 'months').endOf('month').add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> last month' operators
                  if (['on-or-after'].includes(filter.operator) && ((entryDate > startOfMonth && entryDate < endOfMonth) || entryDate > endOfMonth)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> last month' operators
                  else if (['on-or-before'].includes(filter.operator) && ((entryDate > startOfMonth && entryDate < endOfMonth) || entryDate < startOfMonth)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> last month' operators
                  if (['after'].includes(filter.operator) && entryDate > endOfMonth) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> last month' operators
                  else if (['before'].includes(filter.operator) && entryDate < startOfMonth) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }

                // filter combinations for 'date -> next month' operators
                else if (filter.value === 'next-month') {
                  const entryDate = entry[key]?.split('T')[0];
                  const startOfMonth = moment().add(1, 'months').startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
                  const endOfMonth = moment().add(1, 'months').endOf('month').add(1, 'days').format('YYYY-MM-DD');

                  // filter combinations for 'date -> on or after -> next month' operators
                  if (['on-or-after'].includes(filter.operator) && ((entryDate > startOfMonth && entryDate < endOfMonth) || entryDate > endOfMonth)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> on or before -> next month' operators
                  else if (['on-or-before'].includes(filter.operator) && ((entryDate > startOfMonth && entryDate < endOfMonth) || entryDate < startOfMonth)) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> after -> next month' operators
                  if (['after'].includes(filter.operator) && entryDate > endOfMonth) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }

                  // filter combinations for 'date -> before -> next month' operators
                  else if (['before'].includes(filter.operator) && entryDate < startOfMonth) {
                    if (isNotAnd) {
                      let isDup = entries.some((e: any) => { return e.id === entry.id });
                      !isDup && entries.push(entry);
                    } else if (isAnd) {
                      counter++;
                    }
                  }
                }
              }
            }
          }
          // First-comm-date and latest-comm-date filters
          else if (['first-comm-date', 'latest-comm-date'].includes(filterType)) {
            // filter for 'empty' & 'not empty' dates
            if (['untouched'].includes(filter.operator) && !entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }
            // filter combinations for 'date -> past number of dates' && 'date -> future number of dates' operators
            else if (['less-than', 'more-than'].includes(filter.operator)) {
              const entryDate = entry[key]?.split('T')[0];
              const number = Number(filter.value?.split(',')[0]);
              const type = filter.value?.split(',')[1];
              const downTo = moment().subtract(number + 1, type).format('YYYY-MM-DD');

              // filter combinations for 'date -> past number of dates' operators
              if (filter.operator === 'less-than' && (entryDate > downTo)) {
                if (isNotAnd) {
                  let isDup = entries.some((e: any) => { return e.id === entry.id });
                  !isDup && entries.push(entry);
                } else if (isAnd) {
                  counter++;
                }
              }

              // filter combinations for 'date -> future number of dates' operators
              else if (filter.operator === 'more-than' && (entryDate < downTo)) {
                if (isNotAnd) {
                  let isDup = entries.some((e: any) => { return e.id === entry.id });
                  !isDup && entries.push(entry);
                } else if (isAnd) {
                  counter++;
                }
              }
            }
          }
          // Tags filters for 'is' and 'is not'
          else if (['tags'].includes(filterType) && !['empty', 'not-empty'].includes(filter.operator)) {
            const tags = entry[key]?.split(',') || [];
            // filter combinations for 'is' operators
            if (filter.operator === 'is' && tags.includes(filter.value)) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'not' operators
            else if (filter.operator === 'not' && !tags.includes(filter.value)) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }
          }
          // All filters except Date
          else {
            // filter combinations for 'is' operators
            if (filter.operator === 'is' && entry[key] === filter.value) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'not' operators
            else if (filter.operator === 'not' && entry[key] !== filter.value) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'empty' operators
            else if (filter.operator === 'empty' && !entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'not empty' operators
            else if (filter.operator === 'not-empty' && entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'assigned' operators
            else if (filter.operator === 'assigned' && entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'not assigned' operators
            else if (filter.operator === 'not-assigned' && !entry[key]) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'contains' operators
            else if (filter.operator === 'contains' && entry[key].includes(filter.value)) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }

            // filter combinations for 'not contains' operators
            else if (filter.operator === 'not-contains' && !entry[key].includes(filter.value)) {
              if (isNotAnd) {
                let isDup = entries.some((e: any) => { return e.id === entry.id });
                !isDup && entries.push(entry);
              } else if (isAnd) {
                counter++;
              }
            }
          }
        });
        isAnd && counter === filters.length && entries.push(entry);
        counter = 0;
      });
      group.entries = [...entries];
      if (group.entries.length > 0) {
        return group;
      }
    });
  }

  /*
  * Returns column key by id
  */
  getKeyFromId(id: string, columns: any) {
    const column = columns.find((col: any) => {
      return col.id === id;
    });

    return column.key;
  }

  /*
  * Returns column type by id
  */
  getTypeFromId(id: string, columns: any) {
    const column = columns.find((col: any) => {
      return col.id === id;
    });

    return column.type;
  }

  /**
  * Returns workdays
  * @param limit
  * @param type
  */
  getWorkDays(limit: number, type: string) {
    let date = moment();
    let workdays = [];

    while (workdays.length !== limit) {
      if (!['Sat', 'Sun'].includes(moment(date).format('ddd'))) {
        workdays.push(moment(date).format('YYYY-MM-DD'));
      }
      if (type === 'last') {
        date = moment(date).subtract(1, 'days');
      } else if (type === 'next') {
        date = moment(date).add(1, 'days');
      }
    }
    return workdays;
  }

  /**
  * Returns filtered group entries
  * @param groups
  * @param columns
  * @param filter
  */
  searchFilter(groups: any, columns: any, filter: string, data: any) {
    if(filter.length) {
      let statuses: any = [];
      let peoples: any = [];

      let statusColsKeys: any = columns.filter((col: any) => {
        return col.type === 'status';
      }).map((status: any) => { return status.key });

      let peopleColsKeys: any = columns.filter((col: any) => {
        return col.type === 'people';
      }).map((people: any) => { return people.key });

      return groups?.filter((group: any) => {
        statuses = [];
        peoples = [];
        group.entries = group.entries.filter((entry: any) => {
          statusColsKeys.forEach((key: string) => {
            let status = this.getStatusById(columns, key, entry[key]);
            status && statuses.push(status);
          });

          peopleColsKeys.forEach((key: string) => {
            let people = this.getUsersById(data.users, (entry[key]));
            peoples = peoples?.concat(people);
          });
          peoples = peoples?.map((people: any) => { return people?.display_name });

          return (this.getObjectValues(entry)).some((val: any) => {
            if (typeof val !== 'string') {
              return false;
            }

            return val?.toLowerCase()?.includes(filter?.toLowerCase()) ||
              (val === filter) ||
              peoples.join(',')?.toLowerCase()?.includes(filter?.toLowerCase()) ||
              statuses.join(',')?.toLowerCase()?.includes(filter?.toLowerCase())
          });
        });
        if (group.entries.length > 0) {
          return group;
        }
      });
    } else {
      return groups;
    }
  }

  /**
  * Returns group entries filtered by people
  * @param groups
  * @param columns
  * @param user
  */
  filterByPeople(groups: any, columns: any, user: any) {
    if (user) {
      let peoples: any = '';
      let peopleColsKeys: any = columns.filter((col: any) => {
        return col.type === 'people';
      }).map((people: any) => { return people.key });

      return groups?.filter((group: any) => {
        group.entries = group.entries.filter((entry: any) => {
          peoples = '';
          peopleColsKeys.forEach((key: string) => {
            entry[key] && (peoples = peoples ? peoples + ',' + entry[key] : entry[key]);
          });

          return peoples.includes(user.ID);
        });
        if (group.entries.length > 0) {
          return group;
        }
      });
    } else {
      return groups;
    }
  }

  /**
  * Returns group entries sorted by column
  * @param groups
  * @param fieldName
  * @param sortType
  * @param columns
  * @param boardColumns
  */
 //add statusName in the array and sorted it alphabetically
  sortByColumn(groups: any, fieldName: string, sortType: string, columns: any, boardColumns : any) {
    if (fieldName) {
      return groups?.filter((group: any) => {
        let consTemp = columns.find((ele: any) => { return ele.field === fieldName });
        let colsOrder = consTemp?.cellRendererParams?.statuses?.map((status: any) => status?.id);
        let typeCol = consTemp.cellRendererParams?.typeCol;
        if (typeCol == 'status') {
          group.entries = group.entries.sort(this.sortStatuses(fieldName, colsOrder));
        }
        else if (typeCol === "item") {
          group.entries = this.getSortByString(group.entries, fieldName)
        }
        else {
          group.entries = group.entries.sort(this.sortEntries(fieldName));
        }
        sortType === 'desc' && (group.entries.reverse());
        return group;
      });
    } else {
      return groups;
    }
  }

  sortStatuses(fieldName: string, sortingArr: any) {
    return function (a: any, b: any) {
      return sortingArr.indexOf(a[fieldName]) - sortingArr.indexOf(b[fieldName]);
    }
  }

  sortEntries(fieldName: string) {
    return function (a: any, b: any) {
      const nameA = a[fieldName]?.toUpperCase(); // ignore upper and lowercase
      const nameB = b[fieldName]?.toUpperCase(); // ignore upper and lowercase

      const aHas: any = nameA !== '' && nameA !== undefined;
      const bHas: any = nameB !== '' && nameB !== undefined;

      return (bHas - aHas) || (aHas === true && nameA - nameB) || 0;
    }
  }

  public getObjectValues: any = (obj: any) => (obj && typeof obj === 'object')
    ? Object.values(obj).map(this.getObjectValues).flat()
    : [obj];

  /**
     * Returns users by ID
     */
  getUsersById(users: any, ids: string[]) {
    if(ids && users){
      const usersData = users.filter((user: any) => {
        return ids.includes(user.id);
      });
      return usersData;
    }
    return [];
  }

  /**
     * Returns status by ID
     */
  getStatusById(columns: any, field: string, id: string) {
    const col = columns.find((col: any) => {
      return col.key === field;
    });
    let status = col?.statuses.find( (status: any) => {
      return status.id === id
    } );
    return status?.name;
  }

  //sorted the field alphabetically
  getSortByString(entries: any, field: any) {
    return entries.sort((a: any, b: any) => {
      if (a[field] && b[field]) {
        return a[field].toLowerCase() < b[field].toLowerCase()
          ? -1
          : 1
      }
      return
    })

  }
}

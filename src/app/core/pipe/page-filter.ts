import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'pageFilter',
    pure: false
})
export class PageFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.nPageDependentId == filter.nPageId);
    }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  
  transform(value: any, doctorName :string) {
    if(value.lenth === 0 || doctorName === ""){
      return value;
    }
     const users :any=[];
      for(const user of value){
        if (user['DoctorDetail'] === doctorName ){
          users.push(user);
        }
      }
      return users;
  }

}

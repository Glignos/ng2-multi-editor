import { Pipe, PipeTransform } from '@angular/core';
import { fromJS, List } from 'immutable';

@Pipe({
  name: 'tagFilter'
})
export class TagFilterPipe implements PipeTransform {

  transform(value: Object, schema: Object, filterExpression: string): any {
    var schema_pos = schema['properties'];
    console.log(fromJS(value));
    let _value = fromJS(value);
    let filteredPaths = [];
    if (filterExpression) {
      filterExpression.split('/')
        .forEach(tag => {
          var array_value: Object[] = [];
          var final_value: Object[] = [];
          if (Object.prototype.toString.call(value) === '[object Array]') {
            if (schema_pos['type'] === 'array') {
              schema_pos = schema_pos['items']['properties'][tag];
            }
            else {
              schema_pos = schema_pos['properties'][tag];
            }
            for (let one_value in value) {
              if(value[0] === undefined){
                console.log('s');
              }
              if (schema_pos['type'] === 'array') {
                if (value[one_value][tag])
                  array_value.push(value[one_value][tag]);
              }
              else {
                if (value[one_value][0]) {
                  if(value[one_value][0][tag]){
                    array_value.push(value[one_value][0][tag]);
                  }
                }
                else{
                  if(value[one_value][tag]){
                    array_value.push(value[one_value][tag]);
                  }
                }
              }
            }
            value = array_value
          }
          else {
              schema_pos = schema_pos[tag];
              if (schema_pos['type'] === 'array') {
                for (let index in value[tag]) {
                  if(value[tag][index]){
                  array_value.push(value[tag][index]);
                  }
                }
                value = array_value;
              }
              else {
                if(value[tag]){
                value = value[tag];
                }
              }
            }
        });
    }
    return value;
  }

}

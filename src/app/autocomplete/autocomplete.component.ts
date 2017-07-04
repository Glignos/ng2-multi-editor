import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import {TypeaheadMatch} from 'ngx-bootstrap';
import { SchemaKeysStoreService } from '../shared/services/schema-keys-store.service';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements OnInit {

  @Input() options: Array<{}>;
  previous_value = ''
  selected = '';
  noResultsFound = false;

  constructor(private schemaKeysStoreService: SchemaKeysStoreService) { }

  ngOnInit() {
  }

  onModelChange(event: TypeaheadMatch) {
    console.log(event.value);
    let newOptions = this.schemaKeysStoreService.forPath(event.value) ? this.schemaKeysStoreService.forPath(event.value).toArray() : [];
    if (newOptions.length === 0) {
      console.log('No nested keys further!!!');
      return;
    }
    this.options = newOptions
      .map(option => {
        return { currentPath: event.value, nextPath: `${event.value}/${option}`};
      });
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.noResultsFound = e;
  }

  checkUserInput(event) {
    var result = (`${this.selected}${event.key.slice(-1)}`)
    result = result.substring(0,result.lastIndexOf("/"));
    let newOptions = this.schemaKeysStoreService.forPath(result) ? this.schemaKeysStoreService.forPath(result).toArray() : [];
    if (newOptions.length === 0) {
      console.log('No nested keys further!!!');
      return;
    }
    if(result === ''){
        this.options = newOptions
        .map(option => {
          return { currentPath: result, nextPath: `${option}`};
        });
    }
    else{
      this.options = newOptions
        .map(option => {
          return { currentPath: result, nextPath: `${result}/${option}`};
        });
    }
    if (event.which === 46 || event.which === 8) {
      console.log(result);
      this.noResultsFound = false;
    }else if (this.noResultsFound) {
      event.preventDefault();
    }
  }
  
}

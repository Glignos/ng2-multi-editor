import { Injectable } from '@angular/core';
import { fromJS, OrderedSet } from 'immutable';

@Injectable()
export class SchemaKeysStoreService {

  public schemaSeparator = '/';
  public keyStoreMap: { [path: string]: OrderedSet<string> } = {};

  constructor() { }

  public forPath(path: string) {
    console.log(this.keyStoreMap);
    if (path === ''){
      return this.keyStoreMap[''];
    }
    else{
      return this.keyStoreMap[`${this.schemaSeparator}${path}`];
    }
  }

  public buildSchemaKeyStore(schema: {}) {
    this.buildSchemaKeyStoreRecursively('', schema);
  }

  private buildSchemaKeyStoreRecursively(path: string, schema: {}) {

    if (schema['type'] === 'object') {
      let finalKeys = Object.keys(schema['properties']);
      this.keyStoreMap[path] = fromJS(finalKeys).toOrderedSet();
      finalKeys
      .filter(key => this.isObjectOrArraySchema(schema['properties'][key]))
      .forEach(key => {
        let newPath = `${path}${this.schemaSeparator}${key}`;
        this.buildSchemaKeyStoreRecursively(newPath, schema['properties'][key]);
      });

    }

    if (schema['type'] === 'array') {
      if (schema['items']['type'] === 'object') {
        let finalKeys = Object.keys(schema['items']['properties']);
        this.keyStoreMap[path] = fromJS(finalKeys).toOrderedSet();
        finalKeys
        .filter(key => this.isObjectOrArraySchema(schema['items']['properties'][key]))
        .forEach(key => {
          let newPath = `${path}${this.schemaSeparator}${key}`;
          this.buildSchemaKeyStoreRecursively(newPath, schema['items']['properties'][key]);
        });
      }
    }
  }

  private isObjectOrArraySchema(schema: {}) {
    return schema['type'] === 'object' || schema['type'] === 'array';
  }
}

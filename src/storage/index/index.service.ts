import { ColumnMeta, DataRequester, IndexApi } from "@storage/interfaces";
import { ColumnType, DocumentId, Index } from "@storage/types";

export class IndexService implements IndexApi {
  private readonly _indexes = new Map<string, Index>()

  constructor(private readonly _storage: DataRequester) {}
  
  getIndex(column: ColumnMeta): Index {
    const index = this._indexes.get(column.name)
    
    if(!index) {
      throw new Error(`${IndexService.name}. Index not found for ${column.name}`)
    }

    return index
  }

  create(column: ColumnMeta): void {
    const data = this._storage.findAll([column.name])
    
    if(data.length === 0) {
      return
    }

    const values = data.map(document => ({
      id: document.id,
      value: column.type === 'string' ? document.raw[column.name] : parseInt(document.raw[column.name]),
    }))

    values.sort((a, b) => this._compareFunction(a.value, b.value))

    this._indexes.set(column.name, values)
  }

  findOne(column: ColumnMeta, value: string): DocumentId {
    const index = this.getIndex(column)
    const valueIndex = this._binarySearch(index, column.type === 'string' ? value : parseInt(value))
    
    if(valueIndex === null) {
      throw new Error(`${IndexService.name}.findOne. Value not found. ${column.name} = ${value}`)
    }

    return index[valueIndex].id
  }

  traversalFrom(column: ColumnMeta, value: string): Array<DocumentId> {
    const index = this.getIndex(column)
    
    const valueIndex = this._binarySearchGreater(index, column.type === 'string' ? value : parseInt(value))
    if(valueIndex === null) {
      return []
    }

    const result: Array<DocumentId> = []
    for(let i = valueIndex; i < index.length; i++) {
      result.push(index[i].id)
    }

    return result
  }

  // TODO Uncouple 
  private _binarySearch(index: Index, value: ColumnType): number | null {
    let start = 0, end = index.length - 1

    while (start <= end) {
        const mid = Math.floor((start + end) / 2)

        if (index[mid].value === value) return mid

        else if (index[mid].value < value)
            start = mid + 1
        else
            end = mid - 1
    }

    return null
  }

  // TODO Uncouple 
  private _binarySearchGreater(index: Index, value: ColumnType): number | null {
    let start = 0, end = index.length - 1
    while (start <= end) {
        if(start === end && index[start].value > value) {
          return start
        }

        const mid = Math.floor((start + end) / 2)
        if (index[mid].value === value) return mid

        else if (index[mid].value < value)
            start = mid + 1
        else
            end = mid - 1
    }

    return null
  }

  private _compareFunction<T>(valueA: T, valueB: T): number {
    if(valueA > valueB) {
      return 1
    }

    if(valueA < valueB) {
      return -1
    }

    return 0
  }
}
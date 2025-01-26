export interface Id<T> {
  get value(): T
}

export type DocumentId = Id<string>

export type ColumnType = number | string
export type ColumnTypeName = 'number' | 'string'

export type RawDocument = Record<string, string>

export type IndexNode<T> = {
  id: DocumentId
  value: T
}
export type Index = IndexNode<ColumnType>[]

import { MetaService } from "@storage/index";

describe("MetaService", (): void => {
  describe("defineColumnByValue", (): void => {
    it("should define one string column", async (): Promise<void> => {
        const metaService = new MetaService()

        const column = 'col1'
        const value = '3string12'
        metaService.defineColumnByValue(column, value)
       
        const columnsMeta = metaService.columns

        expect(columnsMeta.length).toBe(1)
        expect(columnsMeta[0].name).toBe(column)
        expect(columnsMeta[0].type).toBe('string')
    });

    it("should define one number column", async (): Promise<void> => {
      const metaService = new MetaService()

      const column = 'col_num'
      const value = '1239834'
      metaService.defineColumnByValue(column, value)
     
      const columnsMeta = metaService.columns

      expect(columnsMeta.length).toBe(1)
      expect(columnsMeta[0].name).toBe(column)
      expect(columnsMeta[0].type).toBe('number')
    });

    it("should re-define one number column to string", async (): Promise<void> => {
      const metaService = new MetaService()

      const column = 'col_num'
      const value1 = '1239834'
      const value2= '1239834string'
      metaService.defineColumnByValue(column, value1)
      metaService.defineColumnByValue(column, value2)
     
      const columnsMeta = metaService.columns

      expect(columnsMeta.length).toBe(1)
      expect(columnsMeta[0].name).toBe(column)
      expect(columnsMeta[0].type).toBe('string')
    });

    it("should not re-define one string column to number", async (): Promise<void> => {
      const metaService = new MetaService()

      const column = 'col_num'
      const value1= '1239834string'
      const value2 = '1239834'
      metaService.defineColumnByValue(column, value1)
      metaService.defineColumnByValue(column, value2)
     
      const columnsMeta = metaService.columns

      expect(columnsMeta.length).toBe(1)
      expect(columnsMeta[0].name).toBe(column)
      expect(columnsMeta[0].type).toBe('string')
    });

    it("should define two columns", async (): Promise<void> => {
      const metaService = new MetaService()

      const column1 = 'col1'
      const column2 = 'col2'
      const value1= '1239834string'
      const value2 = '1239834'
      metaService.defineColumnByValue(column1, value1)
      metaService.defineColumnByValue(column2, value2)
     
      const columnsMeta = metaService.columns

      expect(columnsMeta.length).toBe(2)
    });
  });
});

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: any): Promise<number>;
}

export interface IInterpretationRepository extends IRepository<any> {
  findMatchingPatterns(conditions: any): Promise<any[]>;
  findByCategoryId(categoryId: string): Promise<any[]>;
  findActivePatterns(): Promise<any[]>;
}

export interface ISolarTermsRepository extends IRepository<any> {
  findByDate(date: Date): Promise<any>;
  findByDegree(degree: number): Promise<any>;
}

export interface ITimeCorrectionRepository extends IRepository<any> {
  findBySolarTerm(solarTermId: string): Promise<any[]>;
  findByTimeRange(timeRange: any): Promise<any[]>;
}

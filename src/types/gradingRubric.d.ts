export type GradingRubric = {
  criteria: {
    title: string;
    total_points: number;
    maxValueCriteria: {
      description: string;
      value: number;
    };
    averageValueCriteria: {
      description: string;
      value: {
        min: number;
        max: number;
      };
    };
    minValueCriteria: {
      description: string;
      value: {
        min: number;
        max: number;
      };
    };
  }[];
};

export type GradingRubric = {
  open: boolean;
  criteria: {
    title: string;
    total_points: number;
    maxValueCriteria: {
      description: string;
      value: {
        min: number;
        max: number;
      };
    };
    avgValueCriteria: {
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
  };
}[];

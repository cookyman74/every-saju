export const TimeCorrectionRules = {
  calculateTimeCorrection: (date: Date, location: any): number => {
    const longitude = location.longitude;
    const baselineOffset = 15; // 기준 경도
    const timeCorrection = (longitude - baselineOffset) * 4; // 분 단위

    return timeCorrection;
  },

  adjustForSeasonalTime: (date: Date, solarTerm: any): Date => {
    const correctedDate = new Date(date);
    const seasonalCorrection = solarTerm.timeCorrection || 0;

    correctedDate.setMinutes(correctedDate.getMinutes() + seasonalCorrection);
    return correctedDate;
  },
};

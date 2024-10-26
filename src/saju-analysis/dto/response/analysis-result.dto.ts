export class AnalysisResultDto {
  @ApiProperty({ type: [InterpretationResultDto] })
  interpretations: InterpretationResultDto[];

  @ApiProperty()
  sajuPillar: SajuPillarDto;

  @ApiProperty()
  elementAnalysis: ElementAnalysisDto;
}

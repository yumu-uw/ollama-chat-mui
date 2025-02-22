package model

type TagApiResponse struct {
	Models []TagApiResponseModels `json:"models"`
}
type TagApiResponseModelDetails struct {
	Format            string `json:"format"`
	Family            string `json:"family"`
	Families          any    `json:"families"`
	ParameterSize     string `json:"parameter_size"`
	QuantizationLevel string `json:"quantization_level"`
}
type TagApiResponseModels struct {
	Name       string                     `json:"name"`
	ModifiedAt string                     `json:"modified_at"`
	Size       int64                      `json:"size"`
	Digest     string                     `json:"digest"`
	Details    TagApiResponseModelDetails `json:"details"`
}

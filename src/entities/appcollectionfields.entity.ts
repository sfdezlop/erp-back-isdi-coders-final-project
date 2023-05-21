export type AppCollectionField = {
  id: string;
  collectionName: string;
  fieldName: string;
  fieldType: string;
  fieldShortDescription: string;
  filterable: boolean;
  searchable: boolean;
  orderable: boolean;
  htmlTag: string;
  mongoType: string;
  createShow: string;
  detailShow: string;
  galleryShow: string;
  updateShow: string;
  relatedCollectionField: string;
};

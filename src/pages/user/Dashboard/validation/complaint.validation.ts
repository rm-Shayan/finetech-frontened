import * as yup from "yup";

export const complaintSchema = yup.object({
  type: yup.string().required("Complaint type is required"),
  category: yup.string().required("Category is required"),
  priority: yup.string().required("Priority is required"),
  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .notRequired(),
 pdf: yup
  .mixed()
  .notRequired()
  .test(
    "description-or-pdf",
    "Either description or PDF must be provided",
    function (value) {
      const { description } = this.parent;

      // If description exists and not empty → pass
      if (description && description.trim().length > 0) return true;

      // If PDF exists → pass
      if (value) {
        // value can be FileList or array
        if (value instanceof FileList && value.length > 0) return true;
        if (Array.isArray(value) && value.length > 0) return true;
      }

      // Otherwise → fail
      return false;
    }
  ),

  attachments: yup.array().of(yup.mixed()).notRequired(),
});


export type ComplaintFormValues = yup.InferType<typeof complaintSchema>;

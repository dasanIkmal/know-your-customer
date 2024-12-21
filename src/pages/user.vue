<template>
  <div>
    <h2 class="text-4xl font-bold my-10">My Documents</h2>
    <div class="flex gap-20 items-start min-h-screen">
      <div class="sticky p-10 top-0 bg-white rounded-2xl">
        <el-button
          type="primary"
          size="large"
          @click="dialogVisible = true"
          class="shadow-lg"
          >Upload New Document</el-button
        >
      </div>

      <el-dialog
        v-model="dialogVisible"
        title="Upload New Document"
        style="width: 500px"
      >
        <el-form :model="uploadForm" label-position="top">
          <el-form-item label="Document Name" prop="documentName">
            <el-input
              v-model="uploadForm.documentName"
              placeholder="Enter document name"
            ></el-input>
          </el-form-item>
          <el-form-item label="Document File" prop="documentFile">
            <el-upload
              class="upload-demo"
              drag
              action=""
              :on-change="handleFileChange"
              :file-list="fileList"
              :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                Drop file here or click to upload
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpload">Upload</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-table
        :data="documents"
        style="width: 100%"
        class="shadow-lg rounded-2xl"
        size="large"
      >
        <el-table-column
          prop="documentName"
          label="Document Name"
        ></el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rejectionReason" label="Rejection Reason">
          <template #default="scope">
            <el-tag>
              {{
                scope.row.rejectionReason === null
                  ? "N/A"
                  : scope.row.rejectionReason
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="uploadedAt"
          label="Uploaded At"
        ></el-table-column>
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="downloadDocument(scope.row.documentUrl)"
              >Download</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import KYCService from "../services/kycService";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();

const userId = ref(authStore.user.id);

const dialogVisible = ref(false);
const uploadForm = ref({
  documentName: "",
  documentFile: null,
});
const fileList = ref([]);
const documents = ref([]);

const handleFileChange = (file) => {
  uploadForm.value.documentFile = file.raw;
};

const handleUpload = async () => {
  if (!uploadForm.value.documentName || !uploadForm.value.documentFile) {
    ElMessage.error("Please fill in all fields");
    return;
  }
  try {
    const formData = new FormData();

    // Append the file and other fields to FormData
    formData.append("userId", userId.value); // Convert user object to a string
    formData.append("documentName", uploadForm.value.documentName);
    formData.append("file", uploadForm.value.documentFile);

    await KYCService.uploadDocument(formData)
      .then((response) => {
        console.log(response);
        uploadForm.value = {
          documentName: "",
          documentFile: null,
        };
        ElMessage.success("Document uploaded successfully");
        fetchDocuments();
      })
      .catch((error) => {
        console.log(error);
      });
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error("Failed to upload document");
  }
};

const getStatusType = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "pending":
      return "warning";
    default:
      return "";
  }
};

const downloadDocument = (url) => {
  window.open(url, "_blank");
};

const fetchDocuments = async () => {
  try {
    const response = await KYCService.getAllDocsForUser(userId.value);
    documents.value = response.data.documents; // Update the documents table
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    ElMessage.error("Failed to fetch documents");
  }
};

onMounted(() => {
  fetchDocuments(); // Fetch documents when the component is mounted
});
</script>

<style scoped>
/* Add any additional styles here */
</style>

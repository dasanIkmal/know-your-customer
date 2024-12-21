<template>
  <div class="p-6">
    <div class="grid grid-cols-5 gap-4 mb-6">
      <div class="p-4 bg-blue-500 text-white rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">All Users</h3>
        <p class="text-2xl">{{ stats.allUsers }}</p>
      </div>
      <div class="p-4 bg-gray-500 text-white rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">All Documents</h3>
        <p class="text-2xl">{{ stats.allDocuments }}</p>
      </div>
      <div class="p-4 bg-green-500 text-white rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Approved Documents</h3>
        <p class="text-2xl">{{ stats.approvedDocuments }}</p>
      </div>
      <div class="p-4 bg-yellow-500 text-white rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Pending Documents</h3>
        <p class="text-2xl">{{ stats.pendingDocuments }}</p>
      </div>
      <div class="p-4 bg-red-500 text-white rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Rejected Documents</h3>
        <p class="text-2xl">{{ stats.rejectedDocuments }}</p>
      </div>
    </div>
    <!-- Toggle Buttons -->
    <div class="mb-4 flex gap-4">
      <el-button
        type="primary"
        :plain="showDocuments === 'documents' ? true : false"
        @click="switchDocuments('documents')"
      >
        All Documents
      </el-button>
      <el-button
        type="primary"
        :plain="showDocuments === 'users' ? true : false"
        @click="switchDocuments('users')"
      >
        All Users
      </el-button>
    </div>
    <div v-if="showDocuments === 'documents'">
      <el-button-group class="mb-4 shadow-lg" size="large">
        <el-button @click="filterStatus('all')">All</el-button>
        <el-button @click="filterStatus('approved')">Approved</el-button>
        <el-button @click="filterStatus('rejected')">Rejected</el-button>
        <el-button @click="filterStatus('pending')">Pending</el-button>
      </el-button-group>

      <el-table
        :data="filteredDocuments"
        style="width: 100%"
        class="shadow-lg rounded-2xl"
        size="large"
      >
        <el-table-column
          prop="userId"
          label="User ID"
          width="220px"
        ></el-table-column>
        <el-table-column
          prop="documentName"
          label="Document Name"
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
        <el-table-column prop="status" label="Status">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="approvedBy"
          label="Approved By"
        ></el-table-column>
        <el-table-column
          prop="rejectionReason"
          label="Rejection Reason"
        ></el-table-column>
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="success"
              size="small"
              @click="approveDocument(scope.row)"
              >Approve</el-button
            >
            <el-button
              v-if="scope.row.status === 'pending'"
              type="danger"
              size="small"
              @click="openRejectDialog(scope.row)"
              >Reject</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="showDocuments === 'users'">
      <el-table
        :data="allUsers"
        style="width: 100%"
        class="shadow-lg rounded-2xl"
        size="large"
      >
        <el-table-column prop="_id" label="User ID"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="role" label="Role"></el-table-column>
        <el-table-column prop="createdAt" label="Created At">
          <template #default="scope">
            {{ new Date(scope.row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="Updated At">
          <template #default="scope">
            {{ new Date(scope.row.updatedAt).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="rejectDialogVisible"
      title="Reject Document"
      style="width: 500px"
    >
      <el-form :model="rejectForm" label-position="top">
        <el-form-item label="Rejection Reason" prop="rejectionReason">
          <el-input
            v-model="rejectForm.rejectionReason"
            placeholder="Enter rejection reason"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="rejectDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmReject">Confirm</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import KYCService from "../services/kycService";
import { useAuthStore } from "../store/auth";
import { isPlainObject } from "element-plus/es/utils/types.mjs";

const authStore = useAuthStore();

const stats = ref({
  allUsers: 0,
  allDocuments: 0,
  approvedDocuments: 0,
  pendingDocuments: 0,
  rejectedDocuments: 0,
});
const showDocuments = ref("documents"); // Default to true to show the "All Documents" section

const documents = ref([]); // Main list of documents
const filteredDocuments = ref([]); // Filtered list of documents
const allUsers = ref([]); // Main list of users

// Watch documents and initialize filteredDocuments when documents change
watch(documents, (newDocuments) => {
  filteredDocuments.value = [...newDocuments];
});

const rejectDialogVisible = ref(false);
const rejectForm = ref({
  document: null,
  rejectionReason: "",
});

const filterStatus = (status) => {
  if (status === "all") {
    filteredDocuments.value = documents.value;
  } else {
    filteredDocuments.value = documents.value.filter(
      (doc) => doc.status === status
    );
  }
};

const switchDocuments = (section) => {
  if (section === "documents") {
    showDocuments.value = "documents"; // Show the documents section
  } else if (section === "users") {
    showDocuments.value = "users"; // Show the users section
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

const approveDocument = (document) => {
  KYCService.approveDocument(document._id, authStore.user.name).then(
    (response) => {
      if (response.status === 200) {
        ElMessage.success("Document approved");
        fetchDocuments();
      }
    }
  );
};

const openRejectDialog = (document) => {
  rejectForm.value.document = document;
  rejectForm.value.rejectionReason = "";
  rejectDialogVisible.value = true;
};

const confirmReject = () => {
  rejectDialogVisible.value = false;
  KYCService.rejectDocument(
    rejectForm.value.document._id,
    authStore.user.name,
    rejectForm.value.rejectionReason
  ).then((response) => {
    if (response.status === 200) {
      ElMessage.success("Document rejected");
      fetchDocuments();
    }
  });
};

const fetchStats = async () => {
  try {
    const response = await KYCService.getStats();
    stats.value = response.data.stats; // Update stats
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    ElMessage.error("Failed to fetch stats");
  }
};

const fetchDocuments = async () => {
  try {
    const response = await KYCService.getAllDocumnets();
    documents.value = response.data.documents; // Update documents list
    fetchStats();
    fetchUsers();
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    ElMessage.error("Failed to fetch documents");
  }
};

const fetchUsers = async () => {
  try {
    const response = await KYCService.getAllUsers();
    allUsers.value = response.data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    ElMessage.error("Failed to fetch users");
  }
};

onMounted(() => {
  fetchDocuments(); // Fetch documents when component is mounted
});

const downloadDocument = (url) => {
  window.open(url, "_blank");
};
</script>

<style scoped>
/* Add any additional styles here */
</style>

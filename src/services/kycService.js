import axios from "./axios";

const KYCService = {
  async getAllDocsForUser(userId) {
    try {
      const response = await axios.get("/user/getAllKyc/" + userId);
      return response; // Return the response data for further use
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
  async uploadDocument(formdata) {
    try {
      const response = await axios.post("/user/kyc", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error during document upload:", error);
      throw error;
    }
  },
  async getAllDocumnets() {
    try {
      const response = await axios.get("/kyc/getKyc");
      return response;
    } catch (error) {
      console.error("Error during document upload:", error);
      throw error;
    }
  },
  async approveDocument(id, name) {
    try {
      const response = await axios.put(`/kyc/approve/${id}/${name}`);
      return response;
    } catch (error) {
      console.error("Error during document approval:", error);
      throw error;
    }
  },
  async rejectDocument(id, name, reason) {
    try {
      const response = await axios.put(`/kyc/reject/${id}`, {
        name: name,
        reason: reason,
      });
      return response;
    } catch (error) {
      console.error("Error during document rejection:", error);
      throw error;
    }
  },
  async getStats() {
    try {
      const response = await axios.get(`/kyc/stats`);
      return response;
    } catch (error) {
      console.error("Error during getting stats:", error);
      throw error;
    }
  },
  async getAllUsers() {
    try {
      const response = await axios.get(`/kyc/allUsers`);
      return response;
    } catch (error) {
      console.error("Error during getting users:", error);
      throw error;
    }
  },
};

export default KYCService;

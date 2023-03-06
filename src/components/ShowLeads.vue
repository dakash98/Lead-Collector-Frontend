<template>
  <div class="hello">
    <h1>Housing Mark Leads</h1>
    <select v-model="filter_name">
      <option value="name">Client Name</option>
      <option value="ad_name">Ad Name</option>
      <option value="interested_in">Interested In</option>
    </select>
    <input v-model="search_input" placeholder="Search" v-if="!dropdown_options" />
    <select class="form-control" name="template" v-model="selected" v-if="dropdown_options">
        <option v-for="option in dropdown_options" v-bind:value="option" :key="option">
          {{ option }}
        </option>
    </select>
    <input type ="button" value="Search" @click="searchInLeads">
    <div style="align-items:center" v-if="leads">
      <table>
        <tr style="padding: 10px; background-color: coral">
          <th>Name</th>
          <th>Phone Number</th>
          <th>Interested In</th>
          <th>Ad Name</th>
          <th>Email Sent</th>
          <th>New Lead</th>
        </tr>
        <tr style="padding: 10px; background-color: rgb(60, 202, 202)" v-for="lead in leads" :key="lead">
          <td>{{ lead["name"] }}</td>
          <td>{{ lead["phone_number"] }}</td>
          <td>{{ lead["interested_in"] }}</td>
          <td>{{ lead["ad_name"] }}</td>
          <td>{{ lead["email_sent"] }}</td>
          <td>{{ lead["new_lead"] }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ShowLeads",
  props: {
    msg: String,
  },
  data() {
    return {
      leads: [],
      filter_name: "name",
      search_input: "",
      unique_ad_names: [],
      unique_interested_in: [],
      selected: ""
    };
  },
  computed:{
    dropdown_options() {
      console.log(this.filter_name);
      if (this.filter_name == 'ad_name') {
        return this.unique_ad_names
      }
      else if (this.filter_name == 'interested_in'){
        return this.unique_interested_in
      }
      return ""
    }
  },
  mounted() {
    this.fetchLeads();
  },
  methods: {
    async fetchLeads() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/fetch-leads");
        this.leads = response["data"]["leads"];
        this.unique_ad_names = response["data"]["unique_ad_name"]
        this.unique_interested_in = response["data"]["unique_interested_in"]
      } catch (error) {
        console.log(error);
      }
    },
    async searchInLeads() {
      axios
        .post("http://127.0.0.1:8000/fetch-leads", {'search': this.search_input, 'select' : this.filter_name}, {"headers" : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .then((resp) => {
          this.leads = resp["data"]["leads"];
          this.unique_ad_names = resp["data"]["unique_ad_name"]
          this.unique_interested_in = resp["data"]["unique_interested_in"]
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

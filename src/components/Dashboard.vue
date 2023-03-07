<template>
  <div class="hello">
    <h1>Leads Collector</h1>
    <div v-if="leads.length">
      <div style="display: flex; justify-content: center">
        <select v-model="filter_name" @click="resetInputValue()">
          <option value="name">Client Name</option>
          <option value="ad_name">Ad Name</option>
          <option value="interested_in">Interested In</option>
        </select>
        <div style="margin-left: 10px">
          <input
            style="border: 1px solid #ccc"
            v-model="search_input"
            placeholder="Search"
            v-if="!dropdown_options"
          />
          <select
            class="form-control"
            name="template"
            v-model="selected"
            v-if="dropdown_options"
          >
            <option
              v-for="option in dropdown_options"
              v-bind:value="option"
              :key="option"
            >
              {{ option }}
            </option>
          </select>

          <input
            style="margin-left: 3px; border: 1px solid #ccc"
            type="button"
            value="Search"
            @click="searchInLeads"
          />
        </div>
      </div>
      <div style="align-items: center; padding-left: 260px; margin-top: 10px">
        <table>
          <tr style="padding: 10px; background-color: coral">
            <th>Name</th>
            <th>Phone Number</th>
            <th>Interested In</th>
            <th>Ad Name</th>
            <th>Email Sent</th>
            <th>New Lead</th>
          </tr>
          <tr
            style="padding: 10px; background-color: rgb(60, 202, 202)"
            v-for="lead in leads"
            :key="lead"
          >
            <td>{{ lead["name"] }}</td>
            <td>{{ lead["phone_number"] }}</td>
            <td>{{ lead["interested_in"] }}</td>
            <td>{{ lead["ad_name"] }}</td>
            <td>{{ lead["email_sent"] }}</td>
            <td>{{ lead["new_lead"] }}</td>
          </tr>
        </table>
      </div>
      <div>
        <span v-for="idx in page_count" :key="idx">
          <button class="btn-success" @click="fetchLeads(idx)">
            {{ idx }}
          </button>
        </span>
        <button class="btn-success" @click="fetchLeads('all')">Fetch All Leads</button>
      </div>
    </div>
    <div v-else>
      <div>
        <img :src="require('@/assets/image.gif')" alt="" />
      </div>
      <div>Hold On. Fetching Results...</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "FetchAllLeads",
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
      selected: "",
    };
  },
  computed: {
    dropdown_options() {
      console.log(this.filter_name);
      if (this.filter_name == "ad_name") {
        return this.unique_ad_names;
      } else if (this.filter_name == "interested_in") {
        return this.unique_interested_in;
      }
      return "";
    },
  },
  mounted() {
    // setInterval(() => {
    //   this.fetchLeads();
    // }, 10000)
    this.fetchLeads(1);
  },
  methods: {
    resetInputValue() {
      this.search_input = "";
      this.selected = "";
    },
    async fetchLeads(page_no) {
      try {
        const resp = await axios.get(
          `https://lead-collector-ypx7.onrender.com/retrieve-leads/${page_no}`
        );
        this.setLeadsValue(resp);
      } catch (error) {
        console.log(error);
      }
    },
    async searchInLeads(page_no) {
      axios
        .post(
          `https://lead-collector-ypx7.onrender.com/retrieve-leads/${page_no}`,
          {
            search: this.search_input || this.selected,
            select: this.filter_name,
          },
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then((resp) => {
          this.setLeadsValue(resp);
        });
    },
    setLeadsValue(resp) {
      this.leads = resp["data"]["leads"];
      this.unique_ad_names = resp["data"]["unique_ad_name"];
      this.unique_interested_in = resp["data"]["unique_interested_in"];
      this.page_count = resp["data"]["count"];
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
.btn-success {
  margin: 3px 3px 0 3px;
  padding: 4px 15px 4px 15px;
  color: #fff;
  background-color: #00203FFF;
  border-color: #00203FFF;
}
.btn-success:hover {
  background-color: rgb(6, 101, 173);
  border-color: rgb(6, 101, 173);
}
</style>

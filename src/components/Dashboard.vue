<template>
  <div class="hello">
    <h1>Leads Collector</h1>
    <div v-if="leads.length">
      <p>Total Leads : {{ leads.length }}</p>
      <div style="display: flex; justify-content: center">
        <select v-model="filter_name" @click="resetInputValue()" :disabled="is_search_button_active">
          <option value="name">Client Name</option>
          <option value="ad_name">Ad Name</option>
          <option value="interested_in">Interested In</option>
        </select>
        <div style="margin-left: 10px">
          <input
            style="border: 1px solid #ccc"
            v-model="search_input"
            placeholder="Search Client"
            v-if="!dropdown_options"
            :disabled="is_search_button_active"
          />
          <select
            class="form-control"
            name="template"
            v-model="selected"
            v-if="dropdown_options"
            :disabled="is_search_button_active"
          >
            <option value="" disabled selected>Select  {{ filter_name.replace("_", " ") }}</option>
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
            :class="{'btn-success':!is_search_button_active}"
            @click="searchInLeads(page_no)"
            :disabled="is_search_button_active"
          />

          <input
            style="margin-left: 3px; border: 1px solid #ccc"
            type="button"
            :class="{'btn-success':is_search_button_active}"
            value="Reset Filters"
            @click="resetFilters()"
            :disabled="!is_search_button_active"
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
            <th>Created At</th>
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
            <td>{{ lead["created_at"] }}</td>
          </tr>
        </table>
      </div>
      <div>
        <span v-for="idx in page_count" :key="idx">
          <button class="btn-success" @click="fetchLeads(idx)">
            {{ idx }}
          </button>
        </span>
        <button class="btn-success" @click="fetchLeads('all')">
          Fetch All Leads
        </button>
        <button class="btn-success" @click="downloadLeads()">
          Download All Leads
        </button>
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
      page_no: 1,
      is_search_button_active: false
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
    resetFilters() {
      this.filter_name='name';
      this.is_search_button_active=false;
      this.resetInputValue();
      this.fetchLeads(this.page_no);
    },
    resetInputValue() {
      this.search_input = "";
      this.selected = "";
    },
    async fetchLeads(page_no) {
      this.page_no = page_no;
      try {
        const resp = await axios.get(
          `${process.env.VUE_APP_BACKEND_URL}/retrieve-leads/${page_no}`
        );
        this.setLeadsValue(resp);
      } catch (error) {
        console.log(error);
      }
    },
    async searchInLeads(page_no) {
      if ((this.selected == "") & (this.search_input == "")) {
        return "";
      }
      this.is_search_button_active = true;
      this.page_no = page_no;
      axios
        .post(
          `${process.env.VUE_APP_BACKEND_URL}/retrieve-leads/${page_no}`,
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
      this.unique_ad_names=resp["data"]["unique_ad_name"];
      this.unique_interested_in=resp["data"]["unique_interested_in"];
      this.page_count = resp["data"]["count"];
    },
    downloadLeads() {
      axios
        .get(`${process.env.VUE_APP_BACKEND_URL}/download-leads-csv`)
        .then((resp) => {
          // https://stackoverflow.com/questions/58292771/downloading-a-csv-of-file-using-vue-and-js
          var blob = new Blob([resp.data], { type: "text/csv;charset=utf-8;" });
          var link = document.createElement("a");
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "leads_data.csv");
          link.style.visibility = "hidden";
          console.log("url is : ", link);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
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
.btn-success {
  margin: 3px 3px 0 3px;
  padding: 4px 15px 4px 15px;
  color: #fff;
  background-color: #00203fff;
  border-color: #00203fff;
}
.btn-success:hover {
  background-color: rgb(6, 101, 173);
  border-color: rgb(6, 101, 173);
}
/* .btn-success:active {
  background-color: rgb(6, 101, 173);
  border-color: rgb(6, 101, 173);
} */
.btn-success:focus{
  background-color: rgb(6, 101, 173);
  border-color: rgb(6, 101, 173);
}
</style>

<template>
  <div class="container">
    <h1 class="title">Flowchart Vue</h1>
    <h5 class="subtitle">
      Flowchart & Flowchart designer component for Vue.js.
    </h5>
    <div id="toolbar">
      <button
        @click="
          $refs.chart.add({
            id: +new Date(),
            x: 10,
            y: 10,
            name: 'New',
            type: 'operation',
            approvers: [],
          })
        "
      >
        Add(Double-click canvas)
      </button>
      <button @click="$refs.chart.remove()">Delete(Del)</button>
      <button @click="$refs.chart.editCurrent()">
        Edit(Double-click node)
      </button>
      <button @click="$refs.chart.save()">Save</button>
    </div>
    <flowchart
      :nodes="nodes"
      :connections="connections"
      @editnode="handleEditNode"
      :width="'100%'"
      :height="500"
      :readonly="false"
      @dblclick="handleDblClick"
      @editconnection="handleEditConnection"
      @save="handleChartSave"
      @select="handleSelect"
      @selectconnection="handleSelectConnection"
      ref="chart"
    >
    </flowchart>
    <node-dialog
      :visible.sync="nodeDialogVisible"
      :node.sync="nodeForm.target"
    ></node-dialog>
    <connection-dialog
      :visible.sync="connectionDialogVisible"
      :connection.sync="connectionForm.target"
      :operation="connectionForm.operation"
    >
    </connection-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

import ConnectionDialog from "../components/ConnectionDialog";
import NodeDialog from "../components/NodeDialog";
import Flowchart from "../components/flowchart/Flowchart";

export default {
  components: {
    ConnectionDialog,
    NodeDialog,
    Flowchart,
  },
  data: function () {
    return {
      nodes: [
        { id: 1, x: 50, y: 220, name: "Start", type: "start" },
        { id: 2, x: 630, y: 220, name: "End", type: "end" },
        {
          id: 3,
          x: 340,
          y: 130,
          name: "Custom size",
          type: "operation",
          approvers: [{ id: 1, name: "Joyce" }],
          width: 120,
          height: 40,
          connectors: ["left", "right"]
        },
        {
          id: 4,
          x: 240,
          y: 220,
          name: "Operation",
          type: "operation",
          approvers: [{ id: 2, name: "Allen" }],
        },
        {
          id: 5,
          x: 440,
          y: 220,
          name: "Operation",
          type: "operation",
          approvers: [{ id: 3, name: "Teresa" }],
        },
      ],
      connections: [
        {
          source: { id: 1, position: "right" },
          destination: { id: 4, position: "left" },
          id: 1,
          type: "pass",
          name: "id: 1-4",
        },
        {
          source: { id: 4, position: "right" },
          destination: { id: 5, position: "left" },
          id: 2,
          type: "pass",
          name: "id: 4-5",
        },
        {
          source: { id: 5, position: "right" },
          destination: { id: 2, position: "left" },
          id: 3,
          type: "pass",
          name: "id: 5-2",
        },
        {
          source: { id: 5, position: "bottom" },
          destination: { id: 4, position: "bottom" },
          id: 4,
          type: "reject",
          name: "id: 5-4",
        },
        {
          source: { id: 1, position: "top" },
          destination: { id: 3, position: "left" },
          id: 5,
          type: "pass",
          name: "id: 1-3",
        },
        {
          source: { id: 3, position: "right" },
          destination: { id: 2, position: "top" },
          id: 6,
          type: "pass",
          name: "id: 3-2",
        },
        {
          source: { id: 3, position: "bottom" },
          destination: { id: 5, position: "top" },
          id: 7,
          type: "pass",
          name: "id: 3-5",
        },
      ],
      nodeForm: { target: null },
      connectionForm: { target: null, operation: null },
      nodeDialogVisible: false,
      connectionDialogVisible: false,
    };
  },
  async mounted() {},
  methods: {
    handleDblClick(position) {
      this.$refs.chart.add({
        id: +new Date(),
        x: position.x,
        y: position.y,
        name: "New",
        type: "operation",
        approvers: [],
      });
    },
    handleSelect(nodes) {
      // console.log(nodes);
    },
    handleSelectConnection(connections) {
      // console.log(connections);
    },
    async handleChartSave(nodes, connections) {
      // axios.post(url, {nodes, connection}).then(resp => {
      //   this.nodes = resp.nodes;
      //   this.connections = resp.connections;
      //   // Flowchart will refresh after this.nodes and this.connections changed
      // });
    },
    handleEditNode(node) {
      this.nodeForm.target = node;
      this.nodeDialogVisible = true;
    },
    handleEditConnection(connection) {
      this.connectionForm.target = connection;
      this.connectionDialogVisible = true;
    },
  },
};
</script>
<style scoped>
#toolbar {
  margin-bottom: 10px;
}

.title {
  margin-top: 10px;
  margin-bottom: 0;
}

.subtitle {
  margin-bottom: 10px;
}

#toolbar > button {
  margin-right: 4px;
}

.container {
  width: 800px;
  margin: auto;
}
</style>

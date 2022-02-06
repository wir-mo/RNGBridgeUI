<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn
          class="ma-2"
          icon
          color="secondary"
          href="https://github.com/enwi/RNGToWiFi"
          target="_blank"
        >
          <v-icon color="white" large>{{ mdiGithub }}</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-toolbar-title>RNGBridge</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-if="!displaySettings"
        icon
        color="secondary"
        @click="displaySettings = true"
      >
        <v-icon color="white" large>{{ mdiCog }}</v-icon>
      </v-btn>
      <v-btn v-else icon color="secondary" @click="displaySettings = false">
        <v-icon color="white" large>{{ mdiHome }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-banner single-line>
          <!-- <v-icon :color="info_panel.color" slot="icon" size="36"> -->
          <v-icon :color="info_panel.color" size="36">
            {{ info_panel.icon }}
          </v-icon>
          {{ info_panel.message }}
        </v-banner>

        <v-dialog
          transition="dialog-bottom-transition"
          v-model="m_dialog.show"
          max-width="600"
        >
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar class="text-h5" color="primary" dark>{{
                m_dialog.headline
              }}</v-toolbar>
              <v-card-text>
                <div class="text-h6 pa-12">{{ m_dialog.message }}</div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-container grid-list-lg>
          <template v-if="!displaySettings">
            <v-layout row wrap>
              <v-flex xs12 sm6 md4>
                <v-card>
                  <v-app-bar flat color="rgba(0, 0, 0, 0)">
                    <v-icon :color="battery_color" size="24">
                      {{ battery_icon }}
                    </v-icon>
                    <v-toolbar-title class="text-h6 pl-3">
                      Battery
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Capacity:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.b.charge }} %
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Voltage:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.b.voltage.toFixed(2) }} V
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Current:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.b.current.toFixed(2) }} A
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Temperature:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.b.temperature }} °C
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-card>
                  <v-app-bar flat color="rgba(0, 0, 0, 0)">
                    <!-- <v-btn icon :color="status.l.enabled ? 'green' : 'red'"> -->
                    <v-btn icon @click="toggle_load">
                      <v-icon size="24">
                        {{ status.l.enabled ? mdiPowerPlug : mdiPowerPlugOff }}
                      </v-icon>
                    </v-btn>
                    <v-toolbar-title class="text-h6 pl-0">
                      Load
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Voltage:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.l.voltage.toFixed(2) }} V
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Current:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.l.current.toFixed(2) }} A
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Power:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ (status.l.voltage * status.l.current).toFixed(2) }} W
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Enabled:</v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          color="accent"
                          :input-value="status.l.enabled"
                          @click="toggle_load"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-card>
                  <v-app-bar flat color="rgba(0, 0, 0, 0)">
                    <v-icon size="24"> {{ mdiSolarPanel }} </v-icon>
                    <v-toolbar-title class="text-h6 pl-3">
                      Panel
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Voltage:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.p.voltage.toFixed(2) }} V
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Current:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.p.current.toFixed(2) }} A
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Power:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ (status.p.voltage * status.p.current).toFixed(2) }} W
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-card>
                  <v-app-bar flat color="rgba(0, 0, 0, 0)">
                    <v-icon size="24"> {{ mdiServer }} </v-icon>
                    <v-toolbar-title class="text-h6 pl-3">
                      Controller
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Temperature:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.s.temperature }} °C
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>State:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ system_state }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Error:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-chip-group column>
                          <v-tooltip
                            v-for="item in system_errors"
                            :key="item.error"
                            bottom
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-chip
                                color="accent"
                                outlined
                                v-bind="attrs"
                                v-on="on"
                                >{{ item.error }}</v-chip
                              >
                            </template>
                            <span>{{ item.tooltip }}</span>
                          </v-tooltip>
                        </v-chip-group>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-card>
                  <v-app-bar flat color="rgba(0, 0, 0, 0)">
                    <v-icon size="24"> {{ mdiInformation }} </v-icon>
                    <v-toolbar-title class="text-h6 pl-3">
                      Status
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Uptime:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.uptime | sec_to_human }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Heap:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.heap }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
          </template>
          <template v-else>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="4">WiFi</v-col>
                    <v-col cols="8" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <v-row v-if="!open" no-gutters style="width: 100%">
                          <v-col cols="6">
                            {{
                              status.network.wifi_ap.status === "enabled"
                                ? "AP"
                                : "Client"
                            }}
                          </v-col>
                          <v-col cols="6">
                            {{
                              status.network.wifi_ap.status === "enabled"
                                ? status.network.wifi_ap.ip
                                : status.network.wifi_client.ip
                            }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-select
                    label="WiFi mode"
                    persisten-hint
                    @input="set_wifi_mode"
                    :value="wifi_mode"
                    :items="wifiOptions"
                  ></v-select>

                  <template v-if="config.wifi.ap_enabled">
                    <v-text-field
                      label="SSID"
                      v-model="config.wifi.ap_ssid"
                    ></v-text-field>
                    <v-text-field
                      label="Password"
                      type="password"
                      v-model="config.wifi.ap_password"
                    ></v-text-field>
                  </template>

                  <template v-if="config.wifi.client_enabled">
                    <v-text-field
                      label="SSID"
                      v-model="config.wifi.client_ssid"
                    ></v-text-field>
                    <v-text-field
                      label="Password"
                      type="password"
                      v-model="config.wifi.client_password"
                    ></v-text-field>
                    <v-switch
                      v-model="config.wifi.client_dhcp_enabled"
                      label="DHCP"
                    ></v-switch>

                    <template v-if="!config.wifi.client_dhcp_enabled">
                      <v-text-field
                        label="IP"
                        v-model="config.wifi.client_ip"
                      ></v-text-field>
                      <v-text-field
                        label="Netmask"
                        v-model="config.wifi.client_mask"
                      ></v-text-field>
                      <v-text-field
                        label="Gateway"
                        v-model="config.wifi.client_gateway"
                      ></v-text-field>
                      <v-text-field
                        label="DNS"
                        v-model="config.wifi.client_dns"
                      ></v-text-field>
                    </template>
                  </template>
                  <v-btn @click="api_save_wifi">Save WiFi config</v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="4">MQTT</v-col>
                    <v-col cols="8" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <v-row v-if="!open" no-gutters style="width: 100%">
                          <v-col cols="6">
                            {{ status.mqtt.status | capitalize }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-switch
                    v-model="config.mqtt.enabled"
                    :label="config.mqtt.enabled ? 'Enabled' : 'Disabled'"
                  >
                  </v-switch>
                  <template v-if="config.mqtt.enabled">
                    <v-text-field
                      label="Server"
                      v-model="config.mqtt.server"
                    ></v-text-field>
                    <v-text-field
                      label="Port"
                      type="number"
                      v-model="config.mqtt.port"
                    ></v-text-field>
                    <v-text-field
                      label="Id"
                      v-model="config.mqtt.id"
                    ></v-text-field>
                    <v-text-field
                      label="User"
                      v-model="config.mqtt.user"
                    ></v-text-field>
                    <v-text-field
                      label="Password"
                      type="password"
                      v-model="config.mqtt.password"
                    ></v-text-field>
                    <v-text-field
                      label="Topic"
                      v-model="config.mqtt.topic"
                    ></v-text-field>
                  </template>
                  <v-btn @click="api_save_mqtt">Save MQTT config</v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="4">PVOutput</v-col>
                    <v-col cols="8" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <v-row v-if="!open" no-gutters style="width: 100%">
                          <v-col cols="6">
                            {{ status.pvo.status | capitalize }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-switch
                    v-model="config.pvo.enabled"
                    :label="config.pvo.enabled ? 'Enabled' : 'Disabled'"
                  >
                  </v-switch>
                  <template v-if="config.pvo.enabled">
                    <v-text-field
                      label="API Key"
                      v-model="config.pvo.api_key"
                    ></v-text-field>
                    <v-text-field
                      label="System ID"
                      type="number"
                      v-model="config.pvo.system_id"
                    ></v-text-field>
                    <v-text-field
                      label="Time offset from UTC"
                      type="number"
                      v-model="config.pvo.time_offset"
                    ></v-text-field>
                  </template>
                  <v-btn @click="api_save_pvo">Save PVOutput config</v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="4">Software update</v-col>
                    <v-col cols="8" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <v-row v-if="!open" no-gutters style="width: 100%">
                          <v-col cols="6"> Software Version: 1.0.0 </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                    <v-progress-linear
                      :active="ota_progress > 0"
                      v-model="ota_progress"
                      absolute
                      bottom
                    ></v-progress-linear>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-file-input
                    label="Select software binary to upload"
                    accept=".bin, application/octet-stream"
                    truncate-length="50"
                    show-size
                    name="data"
                    required
                    @change="ota_file_changed"
                  ></v-file-input>
                  <v-btn title="Upload software" @click="api_submit_ota">
                    submit
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { api_mixin } from "@/api_mixin";
import {
  mdiGithub,
  mdiCog,
  mdiHome,
  mdiLanConnect,
  mdiLanPending,
  mdiLanDisconnect,
  mdiSolarPanel,
  mdiBattery,
  mdiBatteryOutline,
  mdiBattery10,
  mdiBattery20,
  mdiBattery30,
  mdiBattery40,
  mdiBattery50,
  mdiBattery60,
  mdiBattery70,
  mdiBattery80,
  mdiBattery90,
  mdiPowerPlug,
  mdiPowerPlugOff,
  mdiServer,
  mdiInformation,
} from "@mdi/js";

export default {
  name: "App",
  mixins: [api_mixin],
  components: {
    // Navbar,
  },
  data() {
    return {
      mdiGithub: mdiGithub,
      mdiCog: mdiCog,
      mdiHome: mdiHome,

      mdiLanConnect: mdiLanConnect,
      mdiLanPending: mdiLanPending,
      mdiLanDisconnect: mdiLanDisconnect,

      mdiSolarPanel: mdiSolarPanel,

      mdiPowerPlug: mdiPowerPlug,
      mdiPowerPlugOff: mdiPowerPlugOff,

      mdiServer: mdiServer,

      mdiInformation: mdiInformation,

      displaySettings: false,
      wifiOptions: [
        {
          text: "Client",
          value: "client",
        },
        {
          text: "Access point",
          value: "ap",
        },
      ],

      controllerErrors: {
        0x40000000: "Charge MOS short circuit", // E15
        0x20000000: "Anti-reverse MOS short circuit", // E14
        0x10000000: "Solar panel reversly connected", // E13
        0x8000000: "Solar panel working point over-voltage", // E12
        0x4000000: "Solar panel counter current", // E11
        0x2000000: "Photovoltaic input side over voltage", // E10
        0x1000000: "Photovoltaic input side short circuit", // E9
        0x800000: "Photovoltaic input overpower", // E8
        0x400000: "Ambient temperature too high", // E7
        0x200000: "Controller temperature too high", // E6
        0x100000: "Overpower or load over-current", // E5
        0x80000: "Load short circuit", // E4
        0x40000: "Battery under-voltage warning", // E3
        0x20000: "Battery over-voltage", // E2
        0x10000: "Battery over-discharge", // E1
      },
    };
  },
  computed: {
    wifi_mode() {
      return this.config.wifi.ap_enabled ? "ap" : "client";
    },

    battery_icon() {
      if (this.status.b.charge < 10) {
        return mdiBatteryOutline;
      }
      if (this.status.b.charge < 20) {
        return mdiBattery10;
      }
      if (this.status.b.charge < 30) {
        return mdiBattery20;
      }
      if (this.status.b.charge < 40) {
        return mdiBattery30;
      }
      if (this.status.b.charge < 50) {
        return mdiBattery40;
      }
      if (this.status.b.charge < 60) {
        return mdiBattery50;
      }
      if (this.status.b.charge < 70) {
        return mdiBattery60;
      }
      if (this.status.b.charge < 80) {
        return mdiBattery70;
      }
      if (this.status.b.charge < 90) {
        return mdiBattery80;
      }
      if (this.status.b.charge < 100) {
        return mdiBattery90;
      }
      return mdiBattery;
    },

    battery_color() {
      if (this.status.b.charge < 33) {
        return "red";
      }
      if (this.status.b.charge < 66) {
        return "orange";
      }
      return "green";
    },

    info_panel() {
      switch (this.connectionState) {
        // reconnecting
        case 0:
          return {
            color: "accent",
            icon: mdiLanPending,
            message: "Reconnecting",
          };
        // connected
        case 1:
          return {
            color: "primary",
            icon: mdiLanConnect,
            message: "Connected",
          };
        // disconnected
        default:
          return {
            color: "error",
            icon: mdiLanDisconnect,
            message: "Disconnected",
          };
      }
    },

    system_state() {
      switch (this.status.s.state) {
        case 0:
          return "Charging deactivated";
        case 1:
          return "Charging activated";
        case 2:
          return "MPPT Charging mode";
        case 3:
          return "Equalizing charging mode";
        case 4:
          return "Boost charging mode";
        case 5:
          return "Floating charging mode";
        case 6:
          return "Current limiting (Overpower)";
        default:
          return "Unknown state";
      }
    },

    system_errors() {
      if ((this.status.s.error & 0x7fff0000) > 0) {
        let errors = [];
        let errorVal = 0x10000;
        for (var i = 1; i <= 15; ++i) {
          if ((this.status.s.error & errorVal) > 0) {
            errors.push({
              error: `E${i}`,
              tooltip: this.controllerErrors[errorVal],
            });
          }
          errorVal = errorVal << 1;
        }
        return errors;
      }
      return [{ error: "E0", tooltip: "No error" }];
    },

    ota_progress() {
      return this.status.ota.size <= 0
        ? 0
        : this.status.ota.progress / this.status.ota.size;
    },
  },
  methods: {
    toggle_load() {
      this.api_post_control(!this.status.l.enabled);
    },
    set_wifi_mode(value) {
      value = typeof value == "string" ? value : value.value;
      if (value === "ap") {
        this.config.wifi.ap_enabled = true;
        this.config.wifi.client_enabled = false;
      } else {
        this.config.wifi.ap_enabled = false;
        this.config.wifi.client_enabled = true;
      }
    },
    ota_file_changed(file) {
      this.status.ota.file = file;
      if (file != null) {
        // We need a computed ota_progress value that lies in range [0-100],
        // so we divide by 100 here so we do not need to to multiply later by 100 in every step
        this.status.ota.size = file.size / 100.0;
      } else {
        this.status.ota.size = 0;
      }
    },
  },
};
</script>

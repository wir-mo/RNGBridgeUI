<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn
          class="ma-2"
          icon
          color="secondary"
          href="https://github.com/enwi/RNGBridgeDoc"
          target="_blank"
        >
          <v-icon color="white" large>{{ mdiGithub }}</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-toolbar-title>{{ config.dev.name }}</v-toolbar-title>

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

        <v-banner single-line v-if="status.ota.status">
          <v-icon color="primary" size="36">
            {{ mdiDownload }}
          </v-icon>
          Update available (V{{ status.ota.status }})
          <template v-slot:actions>
            <v-btn
              color="primary"
              text
              :href="
                'https://github.com/enwi/RNGBridgeDoc/releases/download/' +
                status.ota.status +
                '/RNGBridge.ino.bin'
              "
              target="_blank"
            >
              Download
            </v-btn>
          </template>
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
                      Cells
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item
                      v-for="chunk in Math.ceil(status.cells.length / 2)"
                      :key="chunk"
                    >
                      <v-list-item-content
                        >C{{ chunk * 2 - 1 }}:</v-list-item-content
                      >
                      <v-list-item-content class="align-end">
                        {{ status.cells[chunk * 2 - 2].v }} V
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.cells[chunk * 2 - 2].t }} °C
                      </v-list-item-content>
                      <v-list-item-content
                        >C{{ chunk * 2 }}:</v-list-item-content
                      >
                      <v-list-item-content class="align-end">
                        {{ status.cells[chunk * 2 - 1].v }} V
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.cells[chunk * 2 - 1].t }} °C
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
                      BMS
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Current:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.current }} A
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.voltage }} V
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.current * status.voltage }} W
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>SOC:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ (status.remaining / status.total) * 100 }} %
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.remaining }} Ah
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.total }} Ah
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Temperature:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.temperature }} °C
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Ambient:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.ambient[0] }} °C
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.ambient[1] }} °C
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Heater:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.heater[0] }} °C
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.heater[1] }} °C
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Charge Limit:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.chlim.current }} A
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.chlim.voltage }} V
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content
                        >Discharge Limit:</v-list-item-content
                      >
                      <v-list-item-content class="align-end">
                        {{ status.dchlim.current }} A
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.dchlim.temperature }} V
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Cycles:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.cycles }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-card>
                  <v-app-bar flat color="rgba(0, 0, 0, 0)">
                    <v-icon size="24"> {{ mdiElectricSwitch }} </v-icon>
                    <v-toolbar-title class="text-h6 pl-3">
                      Output
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>Out1:</v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          color="accent"
                          v-model="status.o.o1"
                          @change="toggle_out('out1', $event)"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Out2:</v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          color="accent"
                          v-model="status.o.o2"
                          @change="toggle_out('out2', $event)"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Out3:</v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          color="accent"
                          v-model="status.o.o3"
                          @change="toggle_out('out3', $event)"
                        ></v-switch>
                      </v-list-item-action>
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
                        {{ status.heap }} bytes
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>RSSI:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ status.network.rssi }} dBm
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
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">Device</v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-text-field
                    label="Device name"
                    v-model="config.dev.name"
                  ></v-text-field>

                  <v-text-field
                    label="Address"
                    type="number"
                    min="1"
                    max="255"
                    v-model="config.dev.address"
                  ></v-text-field>

                  <v-expansion-panels multiple flat>
                    <v-expansion-panel
                      v-for="control in config.dev.outputControls"
                      :key="control.label"
                      :set="
                        ((enabled = control.inputType != 'disabled'),
                        (inputType = inputTypes[control.inputType]))
                      "
                    >
                      <v-expansion-panel-header class="pa-0">
                        <v-row no-gutters>
                          <v-col cols="4">{{ control.label }}</v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-row no-gutters style="width: 100%">
                              <v-col cols="6">
                                {{
                                  enabled
                                    ? (control.inverted
                                        ? "On below "
                                        : "Off below ") +
                                      `${control.range[0]}${inputType.unit}`
                                    : "Disabled"
                                }}
                              </v-col>
                              <v-col cols="6" v-if="enabled">
                                {{
                                  (control.inverted
                                    ? "Off above "
                                    : "On above ") +
                                  `${control.range[1]}${inputType.unit}`
                                }}
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content flat>
                        <v-select
                          v-model="control.inputType"
                          :items="inputOptions"
                        ></v-select>
                        <v-checkbox v-model="control.inverted">
                          <template v-slot:label>
                            {{ control.inverted ? "Inverted" : "Not inverted" }}
                          </template>
                        </v-checkbox>
                        <v-range-slider
                          track-color="primary"
                          track-fill-color="primary"
                          :disabled="!enabled"
                          v-model="control.range"
                          :step="inputType.step"
                          :min="inputType.min"
                          :max="inputType.max"
                        >
                          <template v-slot:thumb-label="props">
                            <v-icon dark>
                              {{
                                props.value == control.range[0]
                                  ? control.inverted
                                    ? mdiPowerPlug
                                    : mdiPowerPlugOff
                                  : control.inverted
                                  ? mdiPowerPlugOff
                                  : mdiPowerPlug
                              }}
                            </v-icon>
                          </template>
                          <template v-slot:prepend>
                            <v-text-field
                              v-model="control.range[0]"
                              :step="inputType.step"
                              class="mt-0 pt-0"
                              hide-details
                              single-line
                              type="number"
                              style="width: 55px"
                            ></v-text-field>
                          </template>
                          <template v-slot:append>
                            <v-text-field
                              v-model="control.range[1]"
                              :step="inputType.step"
                              class="mt-0 pt-0"
                              hide-details
                              single-line
                              type="number"
                              style="width: 55px"
                            ></v-text-field>
                          </template>
                        </v-range-slider>
                      </v-expansion-panel-content>
                      <v-divider class="m-0"></v-divider>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <v-btn @click="api_save_device">Save Device config</v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>

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
                    <v-text-field
                      label="Update interval (seconds)"
                      type="number"
                      min="1"
                      max="240"
                      v-model="config.mqtt.interval"
                    ></v-text-field>
                    <v-switch
                      v-model="config.mqtt.hadisco"
                      label="Homeassistant Discovery"
                    >
                    </v-switch>
                    <v-text-field
                      v-if="config.mqtt.hadisco"
                      label="Discovery Topic"
                      v-model="config.mqtt.hadiscotopic"
                    ></v-text-field>
                    <v-switch
                      v-model="config.mqtt.split"
                      label="Split data into individual topics"
                    >
                    </v-switch>
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
                          <v-col cols="6">Software Version: 2.12.0</v-col>
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
  mdiElectricSwitch,
  mdiDownload,
  mdiLightningBolt,
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

      mdiElectricSwitch: mdiElectricSwitch,

      mdiDownload: mdiDownload,

      mdiLightningBolt: mdiLightningBolt,

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
        0x80000000: "Fan alarm", // E16
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
      inputTypes: {
        disabled: { unit: "", min: 0, max: 160, step: 0.1 },
        bsoc: { unit: "%", min: 0, max: 100, step: 1 },
        bvoltage: { unit: "V", min: 0, max: 48, step: 0.1 },
        pvoltage: { unit: "V", min: 0, max: 160, step: 0.1 },
        pcurrent: { unit: "A", min: 0, max: 120, step: 0.1 },
      },
      inputOptions: [
        {
          text: "Disabled",
          value: "disabled",
        },
        {
          text: "Battery SOC",
          value: "bsoc",
        },
        {
          text: "Battery Voltage",
          value: "bvoltage",
        },
        {
          text: "Panel Voltage",
          value: "pvoltage",
        },
        {
          text: "Panel Current",
          value: "pcurrent",
        },
      ],
    };
  },
  computed: {
    wifi_mode() {
      return this.config.wifi.ap_enabled ? "ap" : "client";
    },

    battery_icon() {
      const soc = (this.status.remaining / this.status.total) * 100;
      if (soc < 10) {
        return mdiBatteryOutline;
      }
      if (soc < 20) {
        return mdiBattery10;
      }
      if (soc < 30) {
        return mdiBattery20;
      }
      if (soc < 40) {
        return mdiBattery30;
      }
      if (soc < 50) {
        return mdiBattery40;
      }
      if (soc < 60) {
        return mdiBattery50;
      }
      if (soc < 70) {
        return mdiBattery60;
      }
      if (soc < 80) {
        return mdiBattery70;
      }
      if (soc < 90) {
        return mdiBattery80;
      }
      if (soc < 100) {
        return mdiBattery90;
      }
      return mdiBattery;
    },

    battery_color() {
      const soc = (this.status.remaining / this.status.total) * 100;
      if (soc < 33) {
        return "red";
      }
      if (soc < 66) {
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
      if ((this.status.s.error & 0xffff0000) > 0) {
        let errors = [];
        let errorVal = 0x10000;
        for (let i = 1; i <= 16; ++i) {
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
    toggle_out(output, value) {
      const json = {};
      json[output] = value;
      this.api_post_control(json);
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

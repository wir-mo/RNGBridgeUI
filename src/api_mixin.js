import axios from "axios";

export const api_mixin = {
    data: function () {
        return {
            m_dialog: {
                show: false,
                headline: "",
                message: "",
            },
            connectionState: 3,
            status: {
                ota: {
                    status: null,
                    file: null,
                    progress: 0,
                    size: 0,
                },
                uptime: 0,
                heap: 0,
                // MQTT status
                mqtt: {
                    status: "Unknown",
                },
                // PVOutput status
                pvo: {
                    status: "Unknown",
                },
                // System status
                loadEnabledTemp: false,
                b:
                {
                    charge: 0,
                    voltage: 0.0,
                    current: 0.0,
                    temperature: 0.0
                },
                l:
                {
                    // Load status (On=true, Off=false)
                    voltage: 0.0,
                    current: 0.0
                },
                p:
                {
                    voltage: 0.0,
                    current: 0.0
                },
                s:
                {
                    state: 0,
                    error: 0,
                    temperature: 0.0
                },
                // output status
                o:
                {
                    l: false,
                    o1: false,
                    o2: false,
                    o3: false
                },
                network: {
                    rssi: 0,
                    wifi_client: {
                        status: "disabled", //Can be either disabled or connected or disconnected
                        ip: "111.222.333.444",
                        netmask: "255.255.255.0",
                        dns: "1.3.4.5"
                    },
                    wifi_ap: {
                        status: "disabled", //Can be either disabled or enabled
                        ip: "111.222.333.444",
                    },
                },
            },
            config: {
                dev: {
                    name: 'RNGBridge',
                    address: 0xFF,
                    outputControls: {
                        load: {
                            label: "Load Control",
                            inputType: "bsoc",
                            inverted: false,
                            range: [10, 50],
                        },
                        out1: {
                            label: "Output 1",
                            inputType: "bsoc",
                            inverted: false,
                            range: [10, 50],
                        },
                        out2: {
                            label: "Output 2",
                            inputType: "bvoltage",
                            inverted: false,
                            range: [10, 50],
                        },
                        out3: {
                            label: "Output 3",
                            inputType: "bsoc",
                            inverted: false,
                            range: [10, 50],
                        },
                    },
                },
                wifi: {
                    client_enabled: false,
                    client_dhcp_enabled: true,
                    client_ssid: "YourWifi-AP",
                    client_has_password: false,
                    client_password: null,
                    client_ip: "111.222.333.444",
                    client_mask: "255.255.255.0",
                    client_gateway: "111.222.333.555",
                    client_dns: "111.222.333.555",
                    ap_enabled: true,
                    ap_ssid: "LedChristmasTree",
                    ap_has_password: false,
                    ap_password: null,
                },
                mqtt: {
                    enabled: false,
                    server: "111.222.333.444",
                    port: 1883,
                    id: "RNGBridge",
                    user: "xxx",
                    has_password: false,
                    password: null,
                    topic: "/rng",
                    interval: 1,
                    hadisco: false,
                    hadiscotopic: "homeassistant",
                },
                pvo: {
                    enabled: false,
                    api_key: "",
                    system_id: 0,
                    time_offset: 0,
                },
            },
        }
    },
    created() {
        this.setupEventSource();
    },
    methods: {
        setupEventSource() {
            console.debug(`Connecting es: /events`);
            let eventSource = new EventSource("/events");
            this.connectionState = eventSource.readyState;
            eventSource.onopen = () => {
                this.connectionState = eventSource.readyState;
                console.debug("EventSource opened");
                this.request_config();
            };
            eventSource.onclose = () => {
                this.connectionState = eventSource.readyState;
                console.debug("EventSource closed");
            };
            eventSource.onerror = (event) => {
                this.connectionState = eventSource.readyState;
                console.debug(`EventSource error: ${event.type}`);
            };
            eventSource.onmessage = (event) => {
                console.debug(`EventSource message: ${event.data}`);
            };
            eventSource.addEventListener('status', (event) => {
                console.debug(`Event[status]: ${event.data}`);
                let json = JSON.parse(event.data);

                const uptime = json['up'];
                if (uptime != null) {
                    this.status.uptime = uptime;
                }

                const heap = json['he'];
                if (heap != null) {
                    this.status.heap = heap;
                }

                const rssi = json['rssi'];
                if (rssi != null) {
                    this.status.network.rssi = rssi;
                }

                this.checkForBatteryData(json);
                this.checkForLoadData(json);
                this.checkForPanelData(json);
                this.checkForControllerData(json);
                this.checkForNetworkData(json);
                this.checkForOutputData(json);
                this.checkForConfig(json);
            }, false);
            eventSource.addEventListener('ota', (event) => {
                console.debug(`Event[ota]: ${event.data}`);
                this.status.ota.progress = event.data;
            }, false);
        },
        checkForConfig(json) {
            const wifi = json['wifi'];
            if (wifi != null) {
                const client_enabled = wifi["client_enabled"];
                if (client_enabled != null) {
                    this.config.wifi.client_enabled = client_enabled;
                }
                const client_dhcp_enabled = wifi["client_dhcp_enabled"];
                if (client_dhcp_enabled != null) {
                    this.config.wifi.client_dhcp_enabled = client_dhcp_enabled;
                }
                const client_ssid = wifi["client_ssid"];
                if (client_ssid != null) {
                    this.config.wifi.client_ssid = client_ssid;
                }
                const client_has_password = wifi["client_has_password"];
                if (client_has_password != null) {
                    this.config.wifi.client_has_password = client_has_password;
                }
                const client_password = wifi["client_password"];
                if (client_password != null) {
                    this.config.wifi.client_password = client_password;
                }
                const client_ip = wifi["client_ip"];
                if (client_ip != null) {
                    this.config.wifi.client_ip = client_ip;
                }
                const client_mask = wifi["client_mask"];
                if (client_mask != null) {
                    this.config.wifi.client_mask = client_mask;
                }
                const client_gateway = wifi["client_gateway"];
                if (client_gateway != null) {
                    this.config.wifi.client_gateway = client_gateway;
                }
                const client_dns = wifi["client_dns"];
                if (client_dns != null) {
                    this.config.wifi.client_dns = client_dns;
                }
                const ap_enabled = wifi["ap_enabled"];
                if (ap_enabled != null) {
                    this.config.wifi.ap_enabled = ap_enabled;
                }
                const ap_ssid = wifi["ap_ssid"];
                if (ap_ssid != null) {
                    this.config.wifi.ap_ssid = ap_ssid;
                }
                const ap_has_password = wifi["ap_has_password"];
                if (ap_has_password != null) {
                    this.config.wifi.ap_has_password = ap_has_password;
                }
                const ap_password = wifi["ap_password"];
                if (ap_password != null) {
                    this.config.wifi.ap_password = ap_password;
                }
            }

            const mqtt = json['mqtt'];
            if (mqtt != null) {
                const enabled = mqtt["enabled"];
                if (enabled != null) {
                    this.config.mqtt.enabled = enabled;
                }
                const server = mqtt["server"];
                if (server != null) {
                    this.config.mqtt.server = server;
                }
                const port = mqtt["port"];
                if (port != null) {
                    this.config.mqtt.port = port;
                }
                const id = mqtt["id"];
                if (id != null) {
                    this.config.mqtt.id = id;
                }
                const user = mqtt["user"];
                if (user != null) {
                    this.config.mqtt.user = user;
                }
                const has_password = mqtt["has_password"];
                if (has_password != null) {
                    this.config.mqtt.has_password = has_password;
                }
                const password = mqtt["password"];
                if (password != null) {
                    this.config.mqtt.password = password;
                }
                const topic = mqtt["topic"];
                if (topic != null) {
                    this.config.mqtt.topic = topic;
                }
                const interval = mqtt["interval"];
                if (interval != null) {
                    this.config.mqtt.interval = interval;
                }
                const hadisco = mqtt["hadisco"];
                if (hadisco != null) {
                    this.config.mqtt.hadisco = hadisco;
                }
                const hadiscotopic = mqtt["hadiscotopic"];
                if (interval != null) {
                    this.config.mqtt.hadiscotopic = hadiscotopic;
                }
            }
            // Special status update
            const mqtt_status = json["mqttsta"];
            if (mqtt_status != null) {
                this.status.mqtt.status = mqtt_status;
            }

            const pvo = json['pvo'];
            if (pvo != null) {
                const enabled = pvo["enabled"];
                if (enabled != null) {
                    this.config.pvo.enabled = enabled;
                }
                const api_key = pvo["api_key"];
                if (api_key != null) {
                    this.config.pvo.api_key = api_key;
                }
                const system_id = pvo["system_id"];
                if (system_id != null) {
                    this.config.pvo.system_id = system_id;
                }
                const time_offset = pvo["time_offset"];
                if (time_offset != null) {
                    this.config.pvo.time_offset = time_offset;
                }
            }
            // Special status update
            const pvo_status = json["pvosta"];
            if (pvo_status != null) {
                this.status.pvo.status = pvo_status;
            }

            const dev = json["dev"];
            if (dev != null) {
                const name = dev["name"];
                if (name != null) {
                    this.config.dev.name = name;
                }
                const address = dev["address"];
                if (address != null) {
                    this.config.dev.address = address;
                }

                const load = dev["load"];
                if (load != null) {
                    this.updateOutputControl(this.config.dev.outputControls.load, load);
                }
                const out1 = dev["out1"];
                if (out1 != null) {
                    this.updateOutputControl(this.config.dev.outputControls.out1, out1);
                }
                const out2 = dev["out2"];
                if (out2 != null) {
                    this.updateOutputControl(this.config.dev.outputControls.out2, out2);
                }
                const out3 = dev["out3"];
                if (out3 != null) {
                    this.updateOutputControl(this.config.dev.outputControls.out3, out3);
                }
            }

            // Special status update
            const ota_status = json["otasta"];
            if (ota_status != null) {
                this.status.ota.status = ota_status;
            }
        },
        updateOutputControl(control, json) {
            const inputType = json["inputType"];
            if (inputType != null) {
                control.inputType = inputType;
            }
            const inverted = json["inverted"];
            if (inverted != null) {
                control.inverted = inverted;
            }
            const min = json["min"];
            if (min != null) {
                control.range[0] = min;
            }
            const max = json["max"];
            if (max != null) {
                control.range[1] = max;
            }
        },
        checkForNetworkData(json) {
            const network = json['network'];
            if (network != null) {
                const wifi_client = network['wifi_client'];
                if (wifi_client != null) {
                    const status = wifi_client['status'];
                    if (status != null) {
                        this.status.network.wifi_client.status = status;
                    }
                    const ip = wifi_client['ip'];
                    if (ip != null) {
                        this.status.network.wifi_client.ip = ip;
                    }
                    const netmask = wifi_client['netmask'];
                    if (netmask != null) {
                        this.status.network.wifi_client.netmask = netmask;
                    }
                    const dns = wifi_client['dns'];
                    if (dns != null) {
                        this.status.network.wifi_client.dns = dns;
                    }
                }

                const wifi_ap = network['wifi_ap'];
                if (wifi_ap != null) {
                    const status = wifi_ap['status'];
                    if (status != null) {
                        this.status.network.wifi_ap.status = status;
                    }
                    const ip = wifi_ap['ip'];
                    if (ip != null) {
                        this.status.network.wifi_ap.ip = ip;
                    }
                }
            }
        },
        checkForOutputData(json) {
            const output = json['o'];
            if (output != null) {
                this.status.o = output;
            }
        },
        checkForControllerData(json) {
            const system = json['c'];
            if (system != null) {
                const systemState = system['st'];
                if (systemState != null) {
                    this.status.s.state = systemState;
                }
                const systemError = system['er'];
                if (systemError != null) {
                    this.status.s.error = systemError;
                }
                const systemTemperature = system['te'];
                if (systemTemperature != null) {
                    this.status.s.temperature = systemTemperature;
                }
            }
        },
        checkForPanelData(json) {
            const panel = json['p'];
            if (panel != null) {
                const panelVoltage = panel['vo'];
                if (panelVoltage != null) {
                    this.status.p.voltage = panelVoltage;
                }
                const panelCurrent = panel['cu'];
                if (panelCurrent != null) {
                    this.status.p.current = panelCurrent;
                }
            }
        },
        checkForLoadData(json) {
            const load = json['l'];
            if (load != null) {
                const loadVoltage = load['vo'];
                if (loadVoltage != null) {
                    this.status.l.voltage = loadVoltage;
                }
                const loadCurrent = load['cu'];
                if (loadCurrent != null) {
                    this.status.l.current = loadCurrent;
                }
            }
        },
        checkForBatteryData(json) {
            const battery = json['b'];
            if (battery != null) {
                const batteryCharge = battery['ch'];
                if (batteryCharge != null) {
                    this.status.b.charge = batteryCharge;
                }
                const batteryVoltage = battery['vo'];
                if (batteryVoltage != null) {
                    this.status.b.voltage = batteryVoltage;
                }
                const batteryCurrent = battery['cu'];
                if (batteryCurrent != null) {
                    this.status.b.current = batteryCurrent;
                }
                const batteryTemperature = battery['te'];
                if (batteryTemperature != null) {
                    this.status.b.temperature = batteryTemperature;
                }
            }
        },

        request_config() {
            axios.get("/api/config").then(response => {
                this.checkForConfig(response.data);
            }).catch(error => {
                this.m_dialog.headline = "Error";
                this.m_dialog.message = `Could not request config:\n${error}`;
                this.m_dialog.show = true;
            });
        },

        /**
         * Control the renogy charge controller load output and other outputs (Out1, Out2 and Out3)
         * @param {json} json JSON object containing key value pairs where the key is one of 
         * load, out1, out2 or out3 and the value a boolean (true turn on, false turn off)
         */
        api_post_control(json) {
            axios.post("/api/control", json).then(response => {
                if (response.data === "OK") {
                    console.info("/api/control success");
                }
            }).catch(error => {
                this.m_dialog.headline = "Error";
                this.m_dialog.message = `There was an error while trying to control load, out1, out2 or out3:\n${error}`;
                this.m_dialog.show = true;
            });
        },

        api_save_device() {
            let devConfig = { dev: JSON.parse(JSON.stringify(this.config.dev)) };
            devConfig.dev.load = devConfig.dev.outputControls.load;
            devConfig.dev.load.min = devConfig.dev.load.range[0];
            devConfig.dev.load.max = devConfig.dev.load.range[1];
            delete devConfig.dev.load.range;
            delete devConfig.dev.load.label;

            devConfig.dev.out1 = devConfig.dev.outputControls.out1;
            devConfig.dev.out1.min = devConfig.dev.out1.range[0];
            devConfig.dev.out1.max = devConfig.dev.out1.range[1];
            delete devConfig.dev.out1.range;
            delete devConfig.dev.out1.label;

            devConfig.dev.out2 = devConfig.dev.outputControls.out2;
            devConfig.dev.out2.min = devConfig.dev.out2.range[0];
            devConfig.dev.out2.max = devConfig.dev.out2.range[1];
            delete devConfig.dev.out2.range;
            delete devConfig.dev.out2.label;

            devConfig.dev.out3 = devConfig.dev.outputControls.out3;
            devConfig.dev.out3.min = devConfig.dev.out3.range[0];
            devConfig.dev.out3.max = devConfig.dev.out3.range[1];
            delete devConfig.dev.out3.range;
            delete devConfig.dev.out3.label;

            delete devConfig.dev.outputControls;

            this.api_save(devConfig);
        },
        api_save_wifi() {
            this.api_save({ wifi: this.config.wifi });
        },
        api_save_mqtt() {
            if (typeof this.config.mqtt.interval !== 'number') {
                this.config.mqtt.interval = parseInt(this.config.mqtt.interval);
            }
            this.api_save({ mqtt: this.config.mqtt });
        },
        api_save_pvo() {
            // TODO is this really needed?
            if (typeof this.config.pvo.time_offset !== 'number') {
                this.config.pvo.time_offset = parseInt(this.config.pvo.time_offset);
            }
            if (typeof this.config.pvo.system_id !== 'number') {
                this.config.pvo.system_id = parseInt(this.config.pvo.system_id);
            }
            this.api_save({ pvo: this.config.pvo });
        },
        api_save(config) {
            axios.post("/api/config", config).then(response => {
                if (response.data === "OK") {
                    this.m_dialog.headline = "Info";
                    this.m_dialog.message = "Config updated. The page will reload now!";
                    this.m_dialog.show = true;
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    this.m_dialog.headline = "Error";
                    this.m_dialog.message = `Could not update config:\n${response.data}`;
                    this.m_dialog.show = true;
                }
            }).catch(error => {
                this.m_dialog.headline = "Error";
                this.m_dialog.message = `Could not update config:\n${error}`;
                this.m_dialog.show = true;
            });
        },
        api_submit_ota() {
            if (this.status.ota.file == null) {
                this.m_dialog.headline = "Error";
                this.m_dialog.message = "No software binary selected to upload. Please select a file first.";
                this.m_dialog.show = true;
                return;
            }
            if (this.status.ota.progress > 0) {
                this.m_dialog.headline = "Error";
                this.m_dialog.message = "Software update already in progress!";
                this.m_dialog.show = true;
                return;
            }
            let formData = new FormData();
            formData.append("data", this.status.ota.file);
            axios.post("ota", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(() => {
                this.status.ota.progress = 0;
                this.m_dialog.headline = "Update successfull";
                this.m_dialog.message = "The software update was successfull. The page will reload now!";
                this.m_dialog.show = true;
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }).catch(error => {
                this.status.ota.progress = 0;
                this.m_dialog.headline = "Error";
                this.m_dialog.message = `The software update failed.\n${error}`;
                this.m_dialog.show = true;
            });
        },
    }
}



// eslint-disable-next-line no-unused-vars
import { createServer } from 'miragejs'

// const startTime = Date.now()
let status_data = {
	uptime: 1200,
	// MQTT status
	mqtt: {
		status: 'connected', //Can be either disabled or connected or disconnected
	},
	// PVOutput status
	pvo: {
		status: 'disabled', //Can be either disabled or connected or disconnected
	},
	ota: "2.7.3",
	// System status
	loadEnabledTemp: false,
	b:
	{
		charge: 30,
		voltage: 13.5,
		current: 1.45,
		temperature: 25.0
	},
	l:
	{
		// Load status (On=true, Off=false)
		enabled: false,
		voltage: 13.5,
		current: 1.56
	},
	p:
	{
		voltage: 32.6,
		current: 5.45
	},
	s:
	{
		state: 2,
		error: 0xFFFF0000,
		temperature: 25.5
	},
	network: {
		rssi: -75,
		wifi_client: {
			status: 'disabled', //Can be either disabled or connected or disconnected
			ip: '111.222.333.444',
			netmask: '255.255.255.0',
			dns: '1.3.4.5'
		},
		wifi_ap: {
			status: 'disabled', //Can be either disabled or enabled
			ip: '111.222.333.444',
		},
	},
}

let config_data = {
	dev: {
		name: 'CustomName',
	},
	wifi: {
		client_enabled: false,
		client_dhcp_enabled: true,
		client_ssid: 'YourWifi-AP',
		client_has_password: false,
		client_password: null,
		client_ip: '192.168.0.200',
		client_mask: '255.255.255.0',
		client_gateway: '192.168.0.1',
		client_dns: '192.168.0.1',
		ap_enabled: true,
		ap_ssid: 'RNGBridge',
		ap_has_password: false,
		ap_password: '',
	},
	mqtt: {
		enabled: false,
		server: '192.168.1.74',
		port: 1883,
		id: 'RNGBridge',
		user: 'xxx',
		has_password: false,
		password: null,
		topic: '/rng',
	},
	pvo: {
		enabled: false,
		api_key: '',
		system_id: 0,
		time_offset: 0,
	},
}



export function makeServer() {
	createServer({
		routes() {
			this.post('/api/control', (schema, request) => {
				let json = JSON.parse(request.requestBody)
				const loadEnabled = json['enabled'];
				status_data.l.enabled = loadEnabled;
				return 'OK';
			});

			this.post('/api/config', (schema, request) => {
				let json = JSON.parse(request.requestBody)
				const wifiConfig = json['wifi'];
				if (wifiConfig != null) {
					config_data['wifi'] = wifiConfig;
				}
				const mqttConfig = json['mqtt'];
				if (mqttConfig != null) {
					config_data['mqtt'] = mqttConfig;
				}
				const pvoConfig = json['pvo'];
				if (pvoConfig != null) {
					config_data['pvo'] = pvoConfig;
				}
				return 'OK';
			});

			this.get('/api/config', () => {
				return config_data;
			});

			// this.get('/api/status', () => {
			// 	status_data.uptime = (Date.now() - startTime) / 1000
			// 	return status_data
			// })

			// this.get('/events', () => {
			// 	// res.status(200).set();
			// 	// res.write(`data: Hello there \n\n`);
			// 	console.log('/events');
			// 	// return { 'connection': 'keep-alive', 'content-type': 'text/event-stream' };
			// 	let resp = new Response();
			// 	resp.headers.append
			// 	return new Response(200, { 'connection': 'keep-alive', 'content-type': 'text/event-stream' }, `event: status\r\ndata: ${status_data}`);
			// });

			this.passthrough();
			this.passthrough('https://raw.githubusercontent.com/**');
		},
	})

}
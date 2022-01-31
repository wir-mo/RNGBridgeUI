import Vue from 'vue'
import App from './App.vue'


if (process.env.NODE_ENV === "development") {
	import('./esp-api-mock')
		.then((file) => {
			file.makeServer()
		});
}

Vue.config.productionTip = false

import { capitalize, sec_to_human } from "./utils"
import vuetify from './plugins/vuetify'

Vue.filter('capitalize', capitalize)
Vue.filter('sec_to_human', sec_to_human)

new Vue({
	vuetify,
	render: h => h(App)
}).$mount('#app')

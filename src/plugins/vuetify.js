import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

// import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#4CAF50',
                secondary: '#66BB6A',
                accent: '#FFC107',
            },
        },
    },
    icons: {
        iconfont: 'mdiSvg',
    },
});

import Vue from 'vue'
import sync from './sync'
import display from './display'
import popover from './popover'

Vue.directive('sync', sync)
Vue.directive('display', display)
Vue.directive('popover', popover)
<template>
    <div id="app">
        <Layout-Optional v-if="optional"></Layout-Optional>
        <layout-composition v-else></layout-composition>
    </div>
</template>

<script>
import LayoutOptional from './components/Layout-optional';
import layoutComposition from './components/layout-composition';
export default {
    name: 'app',
    components: {
        LayoutOptional,
        layoutComposition,
    },
    data: () => {
        return {
            optional: false,
        };
    },
};
</script>

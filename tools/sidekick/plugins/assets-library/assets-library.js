/**
 * Called when a user tries to load the plugin
 * @param {HTMLElement} container The container to render the plugin in
 * @param {Object} data The data contained in the plugin sheet
 * @param {String} query If search is active, the current search query
 * @param {Object} context contains any properties set when the plugin was registered
 */
export async function decorate(container, data, query, context) {
    // Render your plugin
}

export default {
    title: 'Assets Library',
};
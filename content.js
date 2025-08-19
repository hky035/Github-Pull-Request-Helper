const PROJECT_TITLE = "GH_PR_HELPER";
const CONTAINER_ID = 'pr-description-viewer-container';
const PR_DESCRIPTION_CLASS_NAME = "pr-description-summary";
const CACHE_NAME_PREFIX = "pr-desc-cache"
const CACHE_EXPIRATION_MS = 300000; // 3Min = 3 * 60 * 1000(ms)

/**
 * Fetches the PR description from the network, caches it, and returns the element.
 * 
 * @returns {Promise<Element|null>} The description element or null if failed.
 */
const fetchAndCacheDescription = async (prUrl, cacheKey) => {
    console.log(`[${PROJECT_TITLE}] Fetching description from network.`);
    try {
        const response = await fetch(prUrl);
        if (!response.ok) {
            return null;
        }
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const descriptionElement = doc.querySelector('.comment-body');

        if (descriptionElement) {
            const itemToCache = {
                html: descriptionElement.outerHTML,
                timestamp: Date.now()
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(itemToCache));
            return descriptionElement;
        }
    } catch (error) {
        console.error(`[${PROJECT_TITLE}] Failed to fetch description:`, error);
    }
    return null;
};

/**
 * Injects the Pull Request description into the 'Files Changed' tab.
 */
const injectDescription = async () => {
    observer.disconnect();
    
    try {
        if (document.getElementById(CONTAINER_ID)) return;
        const container = document.getElementById('files');
        if (!container) return;

        const prUrl = window.location.href.replace('/files', '');
        const cacheKey = `${CACHE_NAME_PREFIX}:${prUrl}`;
        let descriptionElement;

        const cachedItemString = sessionStorage.getItem(cacheKey);

        if (cachedItemString) {
            const cachedItem = JSON.parse(cachedItemString);
            const cacheAge = Date.now() - cachedItem.timestamp;

            if (cacheAge < CACHE_EXPIRATION_MS) {
                console.log(`[${PROJECT_TITLE}] Loading description from valid cache.`);
                const parser = new DOMParser();
                const doc = parser.parseFromString(cachedItem.html, 'text/html');
                descriptionElement = doc.body.firstChild;
            } else {
                console.log(`[${PROJECT_TITLE}] Cache expired.`);
            }
        }

        // If description is not loaded from cache (either missing or expired), fetch it.
        if (!descriptionElement) {
            descriptionElement = await fetchAndCacheDescription(prUrl, cacheKey);
        }

        // If we have a description element (from cache or fetch), inject it.
        if (descriptionElement) {
            const descriptionContainer = document.createElement('details');
            descriptionContainer.id = CONTAINER_ID;
            descriptionContainer.open = true;

            const summary = document.createElement('summary');
            summary.textContent = 'Pull Request Description';
            summary.className = PR_DESCRIPTION_CLASS_NAME;

            descriptionContainer.appendChild(summary);
            descriptionContainer.appendChild(descriptionElement);

            container.prepend(descriptionContainer);
        }
    } catch (error) {
        console.error(`[${PROJECT_TITLE}] Error in injectDescription:`, error);
    } finally {
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

// Create a new MutationObserver instance with the callback.
const observer = new MutationObserver(() => {
    if (window.location.href.includes('/files') && !document.getElementById(CONTAINER_ID)) {
        injectDescription();
    }
});

// Start observing the document body for added/removed nodes in the entire subtree.
observer.observe(document.body, { childList: true, subtree: true });

// Run the function once on initial load. This handles cases where the user lands directly on the 'Files changed' page, as the observer only fires on changes.
injectDescription();
import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {LocalService} from "./local.service";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    constructor(private httpService: HttpService, private localStore: LocalService) {
    }

    /**
     * Reload board data from server for Cache purpose
     *
     * @param hard
     */
    reCacheTagsData(hard = true) {
        this.localStore.remove('tags');
        if (hard) {
            this.httpService.getTags().subscribe((data) => {
                this.setTagsCache(data);
            });
        }
    }

    /**
     * Reload board data from server for Cache purpose
     *
     * @param boardId
     * @param hard
     */
    reCacheBoardData(boardId: number, hard = true) {
        this.localStore.remove('board_' + boardId);
        if (hard) {
            this.httpService.getSingleBoard(boardId).subscribe((data:any) => {
                this.setBoardCache(boardId, data);
            });
        }
    }

    /**
     * Reload board data from server for Cache purpose
     *
     * @param boardId
     * @param data
     */
    setBoardCache(boardId: number, data: any) {
        this.localStore.set('board_' + boardId, data);
    }

    /**
     * Set tags cache
     *
     * @param data
     */
    setTagsCache(data: any) {
        this.localStore.set('tags', data);
    }

    /**
     * Get tags data from cache
     */
    getTagsCache() {
        return this.localStore.get('tags');
    }

    /**
     * Set users cache
     *
     * @param data
     */
    setUsersCache(data: any) {
        this.localStore.set('users', data);
    }

    /**
     * Get users data from cache
     */
    getUsersCache() {
        return this.localStore.get('users');
    }

    /**
     * Get board data from cache
     *
     * @param boardId
     */
    getBoardCache(boardId: number|string) {
        return this.localStore.get('board_' + boardId);
    }

    /**
     * Get entry data from cache
     *
     * @param entryId
     * @param metaOnly
     */
    getEntryCache(entryId: number, metaOnly = false) {
        const cacheKey = metaOnly ? 'entry_m_' + entryId : 'entry_' + entryId;
        return this.localStore.get(cacheKey);
    }

    /**
     * Set users cache
     *
     * @param entryId
     * @param data
     * @param metaOnly
     */
    setEntryCache(entryId: number, data: any, metaOnly = false) {
        const cacheKey = metaOnly ? 'entry_m_' + entryId : 'entry_' + entryId;
        this.localStore.set(cacheKey, data);
    }

    /**
     * Reload entry data from server for Cache purpose
     *
     * @param entryId
     * @param hard
     * @param metaOnly
     */
    reCacheEntryData(entryId: number, hard = true, metaOnly = false) {
        const cacheKey = metaOnly ? 'entry_m_' + entryId : 'entry_' + entryId;
        this.localStore.remove(cacheKey);
        if (hard) {
            this.httpService.getSingleEntry(entryId, metaOnly).subscribe((data) => {
                this.localStore.set(cacheKey, data);
            });
        }
    }

    /**
     * Reload touchpoints data from server for Cache purpose
     *
     * @param hard
     */
    reCacheTouchpointsData(hard = true) {
        this.localStore.remove('touchpoints');
        if (hard) {
            this.httpService.getForms().subscribe((data) => {
                this.localStore.set('touchpoints', data);
            });
        }
    }

    /**
     * Reload board data from server for Cache purpose
     *
     * @param boardId
     * @param hard
     */
    reCacheMenu() {
        this.localStore.remove('menuItems');
    }

    /**
     * Get all boards data from cache or server
     */
    async getAllBoards() {
        // First check if this is stored in cache
        const allBoards = this.localStore.get('allBoards');
        if (allBoards) {
            return allBoards;
        }

        // If not in cache, load from server
        await this.httpService.getBoards().subscribe((data: any) => {
            // Set in cache
            this.localStore.set('allBoards', data);

            return data;
        });
    }
}

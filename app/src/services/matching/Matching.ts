// const clone = require('clone');
import * as clone from 'clone';
import { IUser } from '../../interfaces';
import { Categories } from './Categories';
import { log } from '../../logger/';

/**
 * Class to find matching buddies for a user
 */
export class Matching {
    private static readonly MIN_USER_LIST: number = 2;

    /**
     * Counts all active sports activities that the user and a potential buddy have in common
     * @param buddy, A potential Buddy which sports activities should be checked
     * @param me, The user
     * @returns number, The number of sports activities the user and the potential buddy have in common
     */
    private static countSimilarSports(buddy: IUser, me: IUser): number {
        let sum: number = 0;
        // for (let i = 0; i < me.sports.length; i++) {
        //     if (me.sports[i].active && buddy.sports[i].active) {
        //         ++sum;
        //     }
        // }
        return sum;
    }
    private readonly user: IUser;
    private potentialBuddies: IUser[];
    private category: Categories;

    constructor(user: IUser, potentialBuddies: IUser[]) {
        this.user = user;
        this.potentialBuddies = potentialBuddies;
        this.category = new Categories();
    }

    /**
     * Uses all kinds of filters to find matching buddies
     * @returns User[], Array of matching users
     */
    public searchForBuddies(): IUser[] {
        // this.hasBuddy();
        // this.filterNotVerified();
        // this.filterGender();
        // this.filterPhq9();
        // this.filterIpaq();
        // this.filterSportsPreferences();
        // this.filterMeetingDesired();
        log.info(`search for buddies  ${JSON.stringify(this.potentialBuddies,null,' ')}`);
        return this.potentialBuddies;
    }

    /**
     * Checks if potential buddies already have a buddy
     */
    private hasBuddy(): void {
        this.potentialBuddies = this.potentialBuddies.filter((buddy) => !buddy.buddy);
    }

    /**
     * Checks if potential buddies are verified (are ready to search for a buddy)
     */
    private filterNotVerified(): void {
        this.potentialBuddies = this.potentialBuddies.filter((buddy) => buddy.verified);
    }

    /**
     * If user wants the same gender for the buddy. Potential buddies will be filtered
     */
    private filterGender(): void {
        if (this.user.profile.sameGender) {
            this.potentialBuddies = this.potentialBuddies.filter((buddy) => buddy.profile.gender === this.user.profile.gender);
        }
    }

    /**
     * Filters potential buddies after phq9 conditions
     * The user and the potential buddies must be in different categories
     */
    private filterPhq9(): void {
        this.potentialBuddies = this.potentialBuddies.filter((buddy) => {
            return (this.category.getPhq9Category(this.user) !== this.category.getPhq9Category(buddy));
        });
    }

    /**
     * Filters potential buddies after ipaq conditions
     * The user and the potential buddies must be in different categories
     */
    private filterIpaq(): void {
        const tmpBuddyList: IUser[] = clone(this.potentialBuddies);
        this.potentialBuddies = this.potentialBuddies.filter((buddy) => {
            return (this.category.getIpaqCategory(buddy) === this.category.getIpaqCategory(this.user)
                // Der Betrag der Differenz soll maximal eins betragen, da sie nur eine Kategorie von
                // einander entfernt sein sollen
                || Math.abs(this.category.getIpaqCategory(buddy) - this.category.getIpaqCategory(this.user)) === 1)
        });
        if (this.potentialBuddies.length < Matching.MIN_USER_LIST) {
            this.potentialBuddies = tmpBuddyList;
        }
    }

    /**
     * Filters sports preferences to match the users and potential buddies sports activities.
     * If there are less than two potential buddies left, the filter will be ignored.
     */
    private filterSportsPreferences(): void {
        const tmpBuddyList: IUser[] = clone(this.potentialBuddies);
        this.potentialBuddies = this.potentialBuddies.filter((buddy) => Matching.
            countSimilarSports(buddy, this.user) >= 1);
        if (this.potentialBuddies.length < Matching.MIN_USER_LIST) {
            this.potentialBuddies = tmpBuddyList;
        }
    }

    /**
     * If the user desires a physical meeting with is buddy, the filter will sort out potential buddies
     * that do not want a meeting
     * If there are less than two potential buddies left, the filter will be ignored
     */
    private filterMeetingDesired(): void {
        const tmpBuddyList: IUser[] = clone(this.potentialBuddies);
        this.potentialBuddies = this.potentialBuddies.filter((buddy) => buddy.profile.meetingDesired
            && this.user.profile.meetingDesired);
        if (this.potentialBuddies.length < Matching.MIN_USER_LIST) {
            this.potentialBuddies = tmpBuddyList;
        }
    }
}

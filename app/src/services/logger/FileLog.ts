import fs from 'fs';

/**
 * Class to log events - NOT USED
 */
export class FileLog {

    /**
     * Gets the logger object (Singleton pattern)
     * @returns Log, the logger object
     */
    public static getLogger(): FileLog {
        return (this.log) ? this.log : this.log = new FileLog();
    }
    private static log: FileLog = null;

    private constructor() {
    }

    /**
     * Writes a string to the logfile
     * Current locale date and time will be automatically added
     * @param message, String that should be written to the logfile
     * @returns true, if the writing process was successful
     */
    public writeLog(message: string): boolean {
        const old: string = this.readLog();
        const date: Date = new Date();
        const logMessage: string = old
            + date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            + ' ' + message + '\n';
        fs.writeFileSync('./logfiles/Logfile.txt', logMessage);
        return true;
    }

    /**
     * Reads the entries of the logfile
     * @returns string, The entries of the logfile
     */
    public readLog(): string {
        try {
            return fs.readFileSync('./logfiles/Logfile.txt', { encoding: 'utf8' });
        } catch (error) {
            return '';
        }
    }
}

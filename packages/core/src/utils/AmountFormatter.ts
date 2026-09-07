export class AmountFormatter {
    static format(amount: any): string {
        return String(amount ?? '0');
    }
}

export default AmountFormatter;

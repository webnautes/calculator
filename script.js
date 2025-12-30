class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    backspace() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '0' && this.currentOperand === '0') return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
            return;
        }
        if (this.currentOperand.length >= 12) return;
        this.currentOperand += number;
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        if (this.currentOperand.includes('.')) return;
        this.currentOperand += '.';
    }

    percent() {
        if (this.currentOperand === '0') return;
        this.currentOperand = String(parseFloat(this.currentOperand) / 100);
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    calculate() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperand = '오류';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // 소수점 자릿수 제한
        if (result.toString().includes('.')) {
            result = parseFloat(result.toFixed(10));
        }

        this.currentOperand = String(result);
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        if (number === '오류') return '오류';
        if (number === '') return '';

        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('ko-KR', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operation] || operation;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            this.previousOperandElement.textContent =
                `${this.getDisplayNumber(this.previousOperand)} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// DOM 요소 선택
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const buttons = document.querySelectorAll('.btn');

// 계산기 인스턴스 생성
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// 버튼 클릭 이벤트
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;

        switch (action) {
            case 'number':
                calculator.appendNumber(value);
                break;
            case 'operator':
                calculator.chooseOperation(value);
                break;
            case 'decimal':
                calculator.appendDecimal();
                break;
            case 'equals':
                calculator.calculate();
                break;
            case 'clear':
                calculator.clear();
                break;
            case 'backspace':
                calculator.backspace();
                break;
            case 'percent':
                calculator.percent();
                break;
        }

        calculator.updateDisplay();
    });
});

// 키보드 지원
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
    } else if (e.key === '.') {
        calculator.appendDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.calculate();
    } else if (e.key === 'Backspace') {
        calculator.backspace();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        calculator.clear();
    } else if (e.key === '%') {
        calculator.percent();
    }

    calculator.updateDisplay();
});

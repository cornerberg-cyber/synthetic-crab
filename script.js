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
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Handle starting with decimal
        if (this.currentOperand === '0' && number === '.') {
            this.currentOperand = '0.';
            return;
        }

        if (this.currentOperand === '0') {
            this.currentOperand = number.toString();
        } else {
            // Prevent too many digits
            if (this.currentOperand.replace('.', '').length < 15) {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.currentOperand === '0' && this.previousOperand !== '') {
            this.operation = operation;
            return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision issues
        computation = Math.round(computation * 10000000000) / 10000000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        let formattedCurrent = '0';
        if (this.currentOperand !== undefined && this.currentOperand !== null && this.currentOperand !== '') {
            if (this.currentOperand === '0') {
                formattedCurrent = '0';
            } else if (this.currentOperand.toString() === '0.') {
                formattedCurrent = '0,';
            } else {
                 const parts = this.currentOperand.toString().split('.');
                 const intPart = parseInt(parts[0], 10);
                 if (!isNaN(intPart)) {
                    formattedCurrent = intPart.toLocaleString('sv-SE');
                    if (parts.length > 1) {
                         formattedCurrent += ',' + parts[1];
                    } else if (this.currentOperand.toString().endsWith('.')) {
                        formattedCurrent += ',';
                    }
                 }
            }
        }

        this.currentOperandElement.innerText = formattedCurrent;

        if (this.operation != null) {
            let formattedPrev = this.previousOperand;
            const prevParts = this.previousOperand.toString().split('.');
            if (!isNaN(parseInt(prevParts[0], 10))) {
                 formattedPrev = parseInt(prevParts[0], 10).toLocaleString('sv-SE');
                 if (prevParts.length > 1) {
                    formattedPrev += ',' + prevParts[1];
                 }
            }
            this.previousOperandElement.innerText = `${formattedPrev} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', function (event) {
    let patternForNumbers = /[0-9]/g;
    let patternForOperators = /[+\-\*/]/g;
    
    if (event.key.match(patternForNumbers)) {
        event.preventDefault();
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '.' || event.key === ',') {
        event.preventDefault();
        calculator.appendNumber('.');
        calculator.updateDisplay();
    }
    if (event.key.match(patternForOperators)) {
        event.preventDefault();
        let op = event.key;
        if(op === '*') op = '×';
        if(op === '/') op = '÷';
        calculator.chooseOperation(op);
        calculator.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === 'Escape') {
        event.preventDefault();
        calculator.clear();
        calculator.updateDisplay();
    }
});

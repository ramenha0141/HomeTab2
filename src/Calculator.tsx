import { Backspace as BackspaceIcon, Iso as IsoIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

const keys = [
    ['C', '%', 'del', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['neg', '0', '.', '=']
];

const isNumber = (str: string, integer?: boolean) =>
    (integer ? /^-?\d+$/ : /^-?[\d\.]+$/).test(str);

const calculate = (expr: string[]) => {
    if (!expr.length) return null;
    return Exp(expr);
};

const Exp = (exp: string[]) => {
    let result = Factor(exp);
    while (exp.length) {
        switch (exp.shift()) {
            case '+': {
                result += Factor(exp);
                break;
            }
            case '-': {
                result -= Factor(exp);
                break;
            }
        }
    }
    return result;
};

const Factor = (factor: string[]) => {
    let result = Term(factor);
    let op: string = '';
    L: while (factor.length) {
        switch ((op = factor.shift()!)) {
            case '×': {
                result *= Term(factor);
                break;
            }
            case '÷': {
                result /= Term(factor);
                break;
            }
            case '%': {
                result %= Term(factor);
                break;
            }
            default: {
                factor.unshift(op);
                break L;
            }
        }
    }
    return result;
};

const Term = (term: string[]) => {
    let result = term[0] === '-' ? (term.shift(), -1) : 1;
    result *= parseFloat(term.shift()!);
    return result;
};

const Calculator = () => {
    const [expr, setExpr] = useState<string[]>([]);
    const [result, setResult] = useState<number | null>(null);
    const onClick = (key: string) => {
        switch (key) {
            case '+':
            case '-':
            case '×':
            case '÷':
            case '%': {
                if (expr.length && isNumber(expr.at(-1)!)) setExpr(expr.concat(key));
                break;
            }
            case '.': {
                if (expr.length && isNumber(expr.at(-1)!, true)) {
                    const newExpr = [...expr];
                    newExpr.push(newExpr.pop()!.concat(key));
                    setExpr(newExpr);
                }
                break;
            }
            case 'neg': {
                if (expr.length && isNumber(expr.at(-1)!)) {
                    const newExpr = [...expr];
                    if (expr.at(-1)!.startsWith('-')) {
                        newExpr.push(newExpr.pop()!.slice(1));
                    } else {
                        newExpr.push(`-${newExpr.pop()}`);
                    }
                    setExpr(newExpr);
                }
                break;
            }
            case 'C': {
                setExpr([]);
                break;
            }
            case 'del': {
                setExpr(expr.slice(0, -1));
                break;
            }
            case '=': {
                setResult(calculate([...expr]));
                break;
            }
            default: {
                if (expr.length && isNumber(expr.at(-1)!)) {
                    const newExpr = [...expr];
                    newExpr.push(newExpr.pop()!.concat(key));
                    setExpr(newExpr);
                } else {
                    setExpr([...expr, key]);
                }
            }
        }
        if (key !== '=') setResult(null);
    };
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4
            }}
        >
            <Box sx={{ height: 64, display: 'flex', alignItems: 'center', fontSize: 32 }}>
                {expr.length ? expr.join(' ') : 0}
                {result && ` = ${result}`}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.25
                }}
            >
                {keys.map((row, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 0.25 }}>
                        {row.map((key, j) => (
                            <Button
                                key={j}
                                variant={key === '=' ? 'contained' : 'outlined'}
                                sx={{
                                    width: 64,
                                    height: 64,
                                    fontSize: /^[\d.%C]$/.test(key) ? 22 : 28
                                }}
                                onClick={() => onClick(key)}
                            >
                                {key === 'neg' ? (
                                    <IsoIcon />
                                ) : key === 'del' ? (
                                    <BackspaceIcon />
                                ) : (
                                    key
                                )}
                            </Button>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
export default Calculator;

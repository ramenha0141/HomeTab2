import { Box, Button } from '@mui/material';
import { useState } from 'react';

const keys = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
];

const isNumber = (str: string) => /^[\d\.]+$/.test(str);

const Calculator = () => {
    const [expr, setExpr] = useState<string[]>([]);
    const onClick = (key: string) => {
        switch (key) {
            case '+':
            case '-':
            case '×':
            case '÷': {
                if (expr.length && isNumber(expr.at(-1)!)) setExpr(expr.concat(key));
                break;
            }
            case '=': {
                break;
            }
            case '.': {
                if (expr.length && /^\d+$/.test(expr.at(-1)!)) {
                    const newExpr = [...expr];
                    newExpr.push(newExpr.pop()!.concat(key));
                    setExpr(newExpr);
                }
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
                {expr.join(' ')}
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
                                    fontSize: /^[\d.]$/.test(key) ? 22 : 28
                                }}
                                onClick={() => onClick(key)}
                            >
                                {key}
                            </Button>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
export default Calculator;

# Generador de Movimientos Mock

Este directorio contiene scripts para generar datos mock para el desarrollo y pruebas.

## Movimientos (movements.json)

### Descripción
Genera 120 movimientos de inventario con fechas dinámicas que se ajustan automáticamente a la fecha actual.

### Características
- **120 movimientos totales** con la siguiente distribución:
  - 40% ENTRY (entradas de stock)
  - 55% EXIT (salidas de stock)
  - 5% ADJUST_POS / ADJUST_NEG (ajustes)

- **Fechas dinámicas**:
  - 20% con fecha de hoy
  - 50% de los últimos 7 días
  - 30% de los últimos 30 días

- **Usuarios variados**: Los movimientos son creados por supervisores, operadores y admin según corresponda
- **Referencias únicas**: Cada movimiento tiene un reference único para fácil seguimiento

### Uso

#### Generar movimientos
```bash
npm run generate:movements
# o manualmente
node scripts/generateMovements.js
```

#### Cuándo regenerar
- **Después de cada sesión de pruebas**: Si necesitas "resetear" a una fecha más reciente
- **Para probar diferentes escenarios**: El script genera datos aleatorios, así que cada ejecución produce movimientos diferentes
- **Al cambiar el período de pruebas**: Si estabas probando hace una semana y quieres que los datos sean más "actuales"

### Archivo generado
- Ubicación: `public/api/movements.json`
- Formato: JSON array con objetos MovimientoDB
- Se sobrescribe completamente en cada ejecución

### Notas importantes
- Las fechas en los movimientos son relativas al día de ejecución del script
- Los IDs de productos y usuarios hacen referencia a los datos en otros archivos mock
- El script es seguro ejecutar múltiples veces durante el desarrollo

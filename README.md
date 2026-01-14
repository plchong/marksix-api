# Gann Square Prediction API

## `/gann-square-predict`

Predicts Mark Six numbers using the Gann Square (冮恩圖) method.

**GET /gann-square-predict**

### Query Parameters
- `seed` (optional): Comma-separated numbers to use as the seed (e.g. `1,7,15,21,35,42`). If omitted, uses the last draw's main numbers.

### Response
- `predicted`: Array of predicted numbers (expanded from seed)
- `seed`: The input seed numbers
- `method`: 'gann_square_expansion'
- `explanation`: Description of the method
- `timestamp`: Time of prediction

### Example

Request:
```
GET /gann-square-predict?seed=1,7,15,21,35,42
```

Response:
```json
{
	"success": true,
	"predicted": [ ... ],
	"seed": [1,7,15,21,35,42],
	"method": "gann_square_expansion",
	"explanation": "Expands the input seed numbers using the Gann Square (冮恩圖) method, which maps the seed to related positions in a 7x7 Gann Square grid based on row/column overlaps. Used for pattern-based Mark Six prediction.",
	"timestamp": "2025-11-25 20:00:00"
}
```

**Note:** This method is for entertainment and pattern exploration only. It is not scientifically validated for lottery prediction.
# marksix-api
Gann Quare Diagram &amp; Venn Diagram

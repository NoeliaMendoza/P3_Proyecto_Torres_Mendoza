param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\public\icons')
)

Add-Type -AssemblyName System.Drawing

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

function New-EspeConnectIcon {
  param(
    [int]$Size,
    [string]$FileName,
    [bool]$Maskable = $false
  )

  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $background = [System.Drawing.ColorTranslator]::FromHtml('#036666')
  $accent = [System.Drawing.ColorTranslator]::FromHtml('#99E2B4')
  $foreground = [System.Drawing.ColorTranslator]::FromHtml('#FFFFFF')
  $graphics.Clear($background)

  $padding = if ($Maskable) { [int]($Size * 0.20) } else { [int]($Size * 0.13) }
  $ringPen = [System.Drawing.Pen]::new($accent, [single]($Size * 0.035))
  $ringBox = [System.Drawing.RectangleF]::new(
    [single]$padding,
    [single]$padding,
    [single]($Size - (2 * $padding)),
    [single]($Size - (2 * $padding))
  )
  $graphics.DrawEllipse($ringPen, $ringBox)

  $fontSize = if ($Maskable) { $Size * 0.25 } else { $Size * 0.29 }
  $font = [System.Drawing.Font]::new(
    'Segoe UI',
    [single]$fontSize,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $brush = [System.Drawing.SolidBrush]::new($foreground)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString(
    'EC',
    $font,
    $brush,
    [System.Drawing.RectangleF]::new(0, 0, $Size, $Size),
    $format
  )

  $dotBrush = [System.Drawing.SolidBrush]::new($accent)
  $dotSize = [single]($Size * 0.075)
  $dotOffset = if ($Maskable) { $Size * 0.235 } else { $Size * 0.165 }
  $graphics.FillEllipse(
    $dotBrush,
    [single]($Size - $dotOffset - $dotSize),
    [single]($dotOffset),
    $dotSize,
    $dotSize
  )

  $target = Join-Path $resolvedOutput $FileName
  $bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)

  $dotBrush.Dispose()
  $format.Dispose()
  $brush.Dispose()
  $font.Dispose()
  $ringPen.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-EspeConnectIcon -Size 192 -FileName 'icon-192x192.png'
New-EspeConnectIcon -Size 512 -FileName 'icon-512x512.png'
New-EspeConnectIcon -Size 512 -FileName 'icon-maskable-512x512.png' -Maskable $true

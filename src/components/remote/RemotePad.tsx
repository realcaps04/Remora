export function RemotePad({
  onDir,
  onOk,
}: {
  onDir: (dir: 'up' | 'down' | 'left' | 'right') => void
  onOk: () => void
}) {
  return (
    <div className="dpad mx-auto" role="group" aria-label="Directional pad">
      <span className="dpad-dot n" />
      <span className="dpad-dot e" />
      <span className="dpad-dot s" />
      <span className="dpad-dot w" />
      <button type="button" className="dpad-dir up focus-ring" aria-label="Up" onClick={() => onDir('up')} />
      <button type="button" className="dpad-dir right focus-ring" aria-label="Right" onClick={() => onDir('right')} />
      <button type="button" className="dpad-dir down focus-ring" aria-label="Down" onClick={() => onDir('down')} />
      <button type="button" className="dpad-dir left focus-ring" aria-label="Left" onClick={() => onDir('left')} />
      <button type="button" className="dpad-ok focus-ring" aria-label="OK" onClick={onOk} />
    </div>
  )
}

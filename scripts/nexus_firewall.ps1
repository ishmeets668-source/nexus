param (
    [string]$Action = "status",
    [int]$Port = 5173
)

$RuleName = "NEXUS_TACTICAL_SHIELD"

function Get-ShieldStatus {
    $rule = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
    if ($rule) {
        if ($rule.Enabled -eq "True") {
            return "ACTIVE"
        } else {
            return "DORMANT"
        }
    } else {
        return "UNCONFIGURED"
    }
}

# Ensure script is running with necessary privileges for certain actions
# Note: In production, you'd check for Admin rights here.

switch ($Action) {
    "enable" {
        $rule = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
        if ($rule) {
            Enable-NetFirewallRule -DisplayName $RuleName
            Write-Output "SUCCESS: SHIELD_ACTIVATED"
        } else {
            New-NetFirewallRule -DisplayName $RuleName -Direction Inbound -LocalPort $Port -Protocol TCP -Action Allow -Description "Nexus Tactical Dashboard Security Shield"
            Write-Output "SUCCESS: SHIELD_PROVISIONED_AND_ACTIVATED"
        }
    }
    "disable" {
        Disable-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
        Write-Output "SUCCESS: SHIELD_DEACTIVATED"
    }
    "status" {
        $status = Get-ShieldStatus
        Write-Output "STATUS:$status"
        
        # Also get some "threat" info for UI flavor
        $blockedCount = (Get-EventLog -LogName Security -InstanceId 5152 -Newest 10 -ErrorAction SilentlyContinue).Count
        Write-Output "THREATS_ISOLATED:$blockedCount"
    }
    "lockdown" {
        # Drastic measure: Disable rule if it exists
        Disable-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
        # We could also block the port entirely, but for now just disable our allow rule
        Write-Output "SUCCESS: EMERGENCY_LOCKDOWN_INITIATED"
    }
}
